module.exports = {
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
  },
  TRANSACTION_TYPE: {
    IN: 'IN',
    OUT: 'OUT',
    ADJUSTMENT: 'ADJUSTMENT'
  },
  ROLES: {
    ADMIN: 'ADMIN',
    USER: 'USER'
  },
  MESSAGES: {
    TOKEN_MISSING: 'Token não fornecido',
    TOKEN_INVALID: 'Token inválido ou expirado',
    FORBIDDEN: 'Acesso negado: permissão insuficiente',
    WAREHOUSE_NOT_FOUND: 'Armazém não encontrado',
    WAREHOUSE_NAME_DUPLICATE: 'Já existe um armazém com este nome',
    WAREHOUSE_HAS_BALANCES: 'Armazém possui saldos vinculados e não pode ser removido',
    STOCK_BALANCE_NOT_FOUND: 'Saldo de estoque não encontrado',
    TRANSACTION_NOT_FOUND: 'Transação não encontrada',
    INSUFFICIENT_STOCK: 'Estoque insuficiente para esta operação',
    INVALID_QUANTITY: 'A quantidade deve ser um número inteiro maior que zero',
    INVALID_ADJUSTMENT_DELTA: 'O delta de ajuste deve ser um inteiro diferente de zero',
    INVALID_TRANSACTION_TYPE: 'Tipo de transação inválido',
    REQUIRED_FIELD: 'Campo obrigatório não preenchido'
  }
};
