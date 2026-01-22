// This file now re-exports the new request-based modal for backward compatibility
import AccountTypeChangeRequestModal from './account/AccountTypeChangeRequestModal';

// Re-export with the old name for components that still import ChangeAccountTypeModal
export default AccountTypeChangeRequestModal;
