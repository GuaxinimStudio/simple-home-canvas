
import { toast } from 'sonner';

type ValidateStatusChangeParams = {
  isPrazoDefinido: boolean;
};

export const useStatusValidation = () => {
  const validateStatusChange = ({ isPrazoDefinido }: ValidateStatusChangeParams) => {
    if (!isPrazoDefinido) {
      toast.error('É necessário definir um prazo antes de alterar o status.');
      return false;
    }
    return true;
  };

  return {
    validateStatusChange
  };
};
