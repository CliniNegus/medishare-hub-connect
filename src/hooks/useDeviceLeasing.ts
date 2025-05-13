
import { useState, useEffect } from 'react';

// Define window.ethereum interface
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (eventName: string, callback: (...args: any[]) => void) => void;
      removeListener: (eventName: string, callback: (...args: any[]) => void) => void;
    };
  }
}

// ABI will be generated after compilation
const CONTRACT_ABI = [
  // These are placeholder functions - replace with actual ABI after compilation
  "function investInDevice(uint256 _deviceId) external payable",
  "function claimReturns() external",
  "function getPendingReturns(address _investor) external view returns (uint256)",
  "function getInvestorDevices(address _investor) external view returns (uint256[])",
  "function getInvestmentBalance(address _investor, uint256 _deviceId) external view returns (uint256)"
];

// Replace with the actual contract address after deployment
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // Placeholder

export const useDeviceLeasing = () => {
  const [contract, setContract] = useState<any | null>(null);
  const [signer, setSigner] = useState<any | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [investments, setInvestments] = useState<{deviceId: number, amount: string}[]>([]);
  const [pendingReturns, setPendingReturns] = useState<string>("0");

  // Connect to Web3 provider and contract
  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        setError('Please install MetaMask to use this feature');
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      // Get provider and signer - using ethers v6 syntax
      // We'll use dynamic imports to avoid the TypeScript error
      const ethers = await import('ethers');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const newSigner = await provider.getSigner();
      setSigner(newSigner);
      
      // Create contract instance
      const deviceContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        newSigner
      );
      
      setContract(deviceContract);
      setIsConnected(true);
      setError(null);
      
      // Load initial data
      refreshInvestorData(newSigner, deviceContract);
    } catch (err: any) {
      console.error("Error connecting wallet:", err);
      setError(err.message || "Error connecting wallet");
    }
  };

  // Refresh investor data
  const refreshInvestorData = async (
    walletSigner: any, 
    deviceContract: any
  ) => {
    try {
      const address = await walletSigner.getAddress();
      
      // Get investor devices
      const deviceIds = await deviceContract.getInvestorDevices(address);
      
      // Get investment details
      const investmentsData = await Promise.all(
        deviceIds.map(async (deviceId: bigint) => {
          const amount = await deviceContract.getInvestmentBalance(address, deviceId);
          // We'll use dynamic import here too
          const ethers = await import('ethers');
          return {
            deviceId: Number(deviceId),
            amount: ethers.formatEther(amount)
          };
        })
      );
      
      // Get pending returns
      const returns = await deviceContract.getPendingReturns(address);
      const ethers = await import('ethers');
      
      setInvestments(investmentsData);
      setPendingReturns(ethers.formatEther(returns));
    } catch (error: any) {
      console.error("Error loading investor data:", error);
    }
  };

  // Invest in a device
  const investInDevice = async (deviceId: number, amount: string) => {
    if (!contract || !signer) {
      setError('Please connect your wallet first');
      return;
    }
    
    try {
      const ethers = await import('ethers');
      const tx = await contract.investInDevice(deviceId, {
        value: ethers.parseEther(amount)
      });
      
      const receipt = await tx.wait();
      setTransactions([...transactions, {
        type: 'investment',
        hash: receipt.hash,
        deviceId,
        amount
      }]);
      
      await refreshInvestorData(signer, contract);
      return receipt;
    } catch (err: any) {
      console.error("Investment error:", err);
      setError(err.message || "Error investing in device");
      throw err;
    }
  };

  // Claim returns
  const claimReturns = async () => {
    if (!contract || !signer) {
      setError('Please connect your wallet first');
      return;
    }
    
    try {
      const tx = await contract.claimReturns();
      const receipt = await tx.wait();
      
      setTransactions([...transactions, {
        type: 'claim',
        hash: receipt.hash,
        amount: pendingReturns
      }]);
      
      await refreshInvestorData(signer, contract);
      return receipt;
    } catch (err: any) {
      console.error("Claim error:", err);
      setError(err.message || "Error claiming returns");
      throw err;
    }
  };

  // View earnings for a specific device
  const viewEarnings = async (deviceId: number) => {
    if (!contract || !signer) {
      setError('Please connect your wallet first');
      return "0";
    }
    
    try {
      const address = await signer.getAddress();
      const returns = await contract.getPendingReturns(address);
      const ethers = await import('ethers');
      return ethers.formatEther(returns);
    } catch (err: any) {
      console.error("Error viewing earnings:", err);
      setError(err.message || "Error viewing earnings");
      return "0";
    }
  };

  return {
    investInDevice,
    claimReturns,
    viewEarnings,
    connectWallet,
    isConnected,
    error,
    transactions,
    investments,
    pendingReturns
  };
};

export default useDeviceLeasing;
