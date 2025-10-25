-- Script para popular o banco com cupons de exemplo
-- Execute após criar as tabelas

USE linux;

-- Traduzindo nomes das colunas para português
-- Inserir cupons (alguns premium, alguns gratuitos)
INSERT INTO cupons (codigo, titulo, descricao, desconto, categoria, loja, expira_em, e_premium, url_imagem) VALUES
-- Cupons gratuitos
('TECH50', '50% OFF em Eletrônicos', 'Desconto especial em toda linha de eletrônicos', '50%', 'Tecnologia', 'TechStore', '2025-12-31', FALSE, '/placeholder.svg?height=200&width=400'),
('MODA30', '30% OFF em Moda', 'Desconto em roupas e acessórios', '30%', 'Moda', 'Fashion Plus', '2025-11-30', FALSE, '/placeholder.svg?height=200&width=400'),
('FOOD20', '20% OFF em Restaurantes', 'Desconto em pedidos acima de R$50', '20%', 'Alimentação', 'FoodDelivery', '2025-10-31', FALSE, '/placeholder.svg?height=200&width=400'),
('CASA40', '40% OFF em Casa e Decoração', 'Renove sua casa com desconto', '40%', 'Casa', 'HomeDecor', '2025-12-15', FALSE, '/placeholder.svg?height=200&width=400'),

-- Cupons premium (bloqueados para não cadastrados)
('PREMIUM100', 'R$100 OFF em Compras', 'Desconto de R$100 em compras acima de R$300', 'R$100', 'Tecnologia', 'MegaStore', '2025-12-31', TRUE, '/placeholder.svg?height=200&width=400'),
('VIP50', '50% OFF Exclusivo VIP', 'Desconto exclusivo para membros premium', '50%', 'Moda', 'Luxury Fashion', '2025-12-31', TRUE, '/placeholder.svg?height=200&width=400'),
('GOLD70', '70% OFF Gold Member', 'Maior desconto da plataforma', '70%', 'Viagem', 'Travel Agency', '2025-12-31', TRUE, '/placeholder.svg?height=200&width=400'),

-- Mais cupons gratuitos
('LIVRO25', '25% OFF em Livros', 'Desconto em toda seção de livros', '25%', 'Educação', 'BookStore', '2025-11-20', FALSE, '/placeholder.svg?height=200&width=400'),
('SPORT35', '35% OFF em Esportes', 'Equipamentos esportivos com desconto', '35%', 'Esportes', 'SportShop', '2025-10-25', FALSE, '/placeholder.svg?height=200&width=400'),
('BEAUTY15', '15% OFF em Beleza', 'Produtos de beleza e cuidados', '15%', 'Beleza', 'Beauty Store', '2025-11-15', FALSE, '/placeholder.svg?height=200&width=400'),
('PET20', '20% OFF em Pet Shop', 'Desconto em produtos para pets', '20%', 'Pets', 'PetWorld', '2025-12-10', FALSE, '/placeholder.svg?height=200&width=400'),
('GAME45', '45% OFF em Games', 'Jogos e acessórios com desconto', '45%', 'Games', 'GameStore', '2025-12-20', FALSE, '/placeholder.svg?height=200&width=400');
