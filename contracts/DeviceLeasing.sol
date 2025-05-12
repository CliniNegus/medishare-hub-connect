
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

/**
 * @title DeviceLeasing
 * @dev Smart contract for Clinibuilds' device leasing and investor revenue split system
 */
contract DeviceLeasing is ReentrancyGuard, Ownable {
    using Math for uint256;

    // Structs
    struct Device {
        uint256 id;
        string name;
        address manufacturer;
        uint256 totalFunding;
        uint256 totalRevenue;
        bool active;
        uint256 pricePerUse;
        uint256 usageCount;
    }

    struct Investment {
        address investor;
        uint256 deviceId;
        uint256 amount;
        uint256 timestamp;
        uint256 shares; // Proportional ownership
    }

    struct FeeStructure {
        uint256 platformFeePercentage;  // % to Clinibuilds
        uint256 manufacturerFeePercentage; // % to manufacturer
    }

    // State variables
    mapping(uint256 => Device) public devices;
    mapping(uint256 => mapping(address => uint256)) public investments;
    mapping(uint256 => address[]) public deviceInvestors;
    mapping(address => uint256[]) public investorDevices;
    mapping(address => uint256) public pendingReturns;
    mapping(uint256 => uint256) public deviceRevenue;
    mapping(uint256 => uint256) public manufacturerRevenue;
    uint256 public platformRevenue;
    uint256 public platformFeePercentage = 5; // 5% default platform fee
    uint256 public constant PERCENTAGE_DENOMINATOR = 100;
    
    // Events
    event DeviceRegistered(uint256 indexed deviceId, string name, address manufacturer);
    event InvestmentMade(address indexed investor, uint256 indexed deviceId, uint256 amount);
    event DeviceUsageLogged(uint256 indexed deviceId, uint256 usageCount, uint256 revenue);
    event RevenueDistributed(uint256 indexed deviceId, uint256 totalAmount);
    event ReturnsClaimed(address indexed investor, uint256 amount);
    
    // Constructor
    constructor() Ownable(msg.sender) {}

    /**
     * @dev Register a new device in the system
     * @param _deviceId Unique identifier for the device
     * @param _name Name of the device
     * @param _manufacturer Address of the device manufacturer
     * @param _pricePerUse Price charged per use of the device
     */
    function registerDevice(
        uint256 _deviceId, 
        string memory _name, 
        address _manufacturer, 
        uint256 _pricePerUse
    ) external onlyOwner {
        require(_manufacturer != address(0), "Invalid manufacturer address");
        require(_pricePerUse > 0, "Price per use must be greater than zero");
        require(devices[_deviceId].id == 0, "Device already registered");
        
        devices[_deviceId] = Device({
            id: _deviceId,
            name: _name,
            manufacturer: _manufacturer,
            totalFunding: 0,
            totalRevenue: 0,
            active: true,
            pricePerUse: _pricePerUse,
            usageCount: 0
        });
        
        emit DeviceRegistered(_deviceId, _name, _manufacturer);
    }
    
    /**
     * @dev Invest in a specific device
     * @param _deviceId ID of the device to invest in
     */
    function investInDevice(uint256 _deviceId) external payable nonReentrant {
        require(msg.value > 0, "Investment amount must be greater than zero");
        require(devices[_deviceId].id != 0, "Device does not exist");
        require(devices[_deviceId].active, "Device is not active");
        
        // Update device total funding
        devices[_deviceId].totalFunding += msg.value;
        
        // If first investment from this investor for this device, add to arrays
        if (investments[_deviceId][msg.sender] == 0) {
            deviceInvestors[_deviceId].push(msg.sender);
            investorDevices[msg.sender].push(_deviceId);
        }
        
        // Update investment amount
        investments[_deviceId][msg.sender] += msg.value;
        
        emit InvestmentMade(msg.sender, _deviceId, msg.value);
    }
    
    /**
     * @dev Log device usage and distribute revenue
     * @param _deviceId ID of the device used
     * @param _usageCount Number of times the device was used
     */
    function logDeviceUsage(uint256 _deviceId, uint256 _usageCount) external onlyOwner {
        require(devices[_deviceId].id != 0, "Device does not exist");
        require(_usageCount > 0, "Usage count must be greater than zero");
        
        Device storage device = devices[_deviceId];
        uint256 revenue = _usageCount * device.pricePerUse;
        
        // Update device stats
        device.usageCount += _usageCount;
        device.totalRevenue += revenue;
        
        // Distribute revenue
        _distributeRevenue(_deviceId, revenue);
        
        emit DeviceUsageLogged(_deviceId, _usageCount, revenue);
    }
    
    /**
     * @dev Internal function to distribute revenue among stakeholders
     * @param _deviceId ID of the device
     * @param _revenue Amount of revenue to distribute
     */
    function _distributeRevenue(uint256 _deviceId, uint256 _revenue) internal {
        Device storage device = devices[_deviceId];
        
        // Calculate platform fee
        uint256 platformFee = (_revenue * platformFeePercentage) / PERCENTAGE_DENOMINATOR;
        platformRevenue += platformFee;
        
        // Calculate manufacturer fee (default 15%)
        uint256 manufacturerFeePercentage = 15;
        uint256 manufacturerFee = (_revenue * manufacturerFeePercentage) / PERCENTAGE_DENOMINATOR;
        manufacturerRevenue[_deviceId] += manufacturerFee;
        
        // Remaining revenue goes to investors based on their share
        uint256 investorRevenue = _revenue - platformFee - manufacturerFee;
        
        // If there are investors, distribute accordingly
        if (device.totalFunding > 0) {
            address[] memory investors = deviceInvestors[_deviceId];
            for (uint256 i = 0; i < investors.length; i++) {
                address investor = investors[i];
                uint256 investorShare = (investments[_deviceId][investor] * investorRevenue) / device.totalFunding;
                pendingReturns[investor] += investorShare;
            }
        } else {
            // If no investors, add to platform revenue
            platformRevenue += investorRevenue;
        }
        
        emit RevenueDistributed(_deviceId, _revenue);
    }
    
    /**
     * @dev Claim investment returns
     */
    function claimReturns() external nonReentrant {
        uint256 amount = pendingReturns[msg.sender];
        require(amount > 0, "No returns to claim");
        
        pendingReturns[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        
        emit ReturnsClaimed(msg.sender, amount);
    }
    
    /**
     * @dev Withdraw platform revenue
     */
    function withdrawClinibuildsRevenue() external onlyOwner nonReentrant {
        uint256 amount = platformRevenue;
        require(amount > 0, "No platform revenue to withdraw");
        
        platformRevenue = 0;
        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "Transfer failed");
    }
    
    /**
     * @dev Withdraw manufacturer revenue
     * @param _deviceId ID of the device
     */
    function withdrawManufacturerRevenue(uint256 _deviceId) external nonReentrant {
        Device storage device = devices[_deviceId];
        require(msg.sender == device.manufacturer, "Only manufacturer can withdraw");
        
        uint256 amount = manufacturerRevenue[_deviceId];
        require(amount > 0, "No manufacturer revenue to withdraw");
        
        manufacturerRevenue[_deviceId] = 0;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
    }
    
    /**
     * @dev Set platform fee percentage
     * @param _newFee New platform fee percentage
     */
    function setPlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 20, "Fee cannot exceed 20%");
        platformFeePercentage = _newFee;
    }
    
    /**
     * @dev Set device active status
     * @param _deviceId ID of the device
     * @param _isActive New active status
     */
    function setDeviceActive(uint256 _deviceId, bool _isActive) external onlyOwner {
        require(devices[_deviceId].id != 0, "Device does not exist");
        devices[_deviceId].active = _isActive;
    }
    
    /**
     * @dev Get investment balance for an investor and device
     * @param _investor Address of the investor
     * @param _deviceId ID of the device
     * @return Investment amount
     */
    function getInvestmentBalance(address _investor, uint256 _deviceId) public view returns (uint256) {
        return investments[_deviceId][_investor];
    }
    
    /**
     * @dev Get all devices an investor has invested in
     * @param _investor Address of the investor
     * @return Array of device IDs
     */
    function getInvestorDevices(address _investor) public view returns (uint256[] memory) {
        return investorDevices[_investor];
    }
    
    /**
     * @dev Get pending returns for an investor
     * @param _investor Address of the investor
     * @return Pending returns amount
     */
    function getPendingReturns(address _investor) public view returns (uint256) {
        return pendingReturns[_investor];
    }
}
