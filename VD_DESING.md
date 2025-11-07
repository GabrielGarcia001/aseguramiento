# Diseño de la base de datos (ER + DDL)

## Tablas principales
1. products
- id SERIAL PRIMARY KEY
- name VARCHAR(150) NOT NULL
- sku VARCHAR(100) UNIQUE NOT NULL
- quantity INT NOT NULL DEFAULT 0
- price NUMERIC(12,2) NOT NULL DEFAULT 0
- supplier VARCHAR(150)
- min_stock INT DEFAULT 0
- created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
- updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()

2. users
- id SERIAL PRIMARY KEY
- username VARCHAR(100) UNIQUE NOT NULL
- password_hash VARCHAR(255) NOT NULL
- role VARCHAR(20) NOT NULL DEFAULT 'employee'
- created_at TIMESTAMP WITH TIME ZONE DEFAULT now()

3. inventory_movements
- id SERIAL PRIMARY KEY
- product_id INT REFERENCES products(id)
- user_id INT REFERENCES users(id)
- quantity INT NOT NULL
- movement_type VARCHAR(10) NOT NULL
- note TEXT
- created_at TIMESTAMP WITH TIME ZONE DEFAULT now()

## Indices recomendados
- CREATE INDEX idx_products_sku ON products(sku);
- CREATE INDEX idx_products_name ON products(name);

## ER diagram
- Recomendación: importar este esquema en dbdiagram.io o draw.io y generar PNG.
