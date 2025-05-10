
export const traduzirRole = (role: string): string => {
  switch (role) {
    case 'administrador':
      return 'Administrador';
    case 'vereador':
      return 'Vereador';
    default:
      return role;
  }
};
