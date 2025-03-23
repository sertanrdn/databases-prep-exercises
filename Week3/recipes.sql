-- Was your database already in 2NF / 3 NF?
-- 1NF:
    -- Single valued columns
    -- Unique names for columns
    -- No duplicate records
    -- Every table has a primary key
    -- Order doesn't matter

-- 2NF: 
    -- It is in 1NF 
    -- No partial dependencies exist (all non-key columns depend on the entire primary key, not just part of it)

-- 3NF:
    -- It is in 2NF
    -- No transitive dependencies

-- Our database was already in 2. normal form however we can improve it to meet 3. normal form

USE recipes_db;

-- Create Recipes Table
CREATE TABLE IF NOT EXISTS Recipes (
    RecipeID INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Create Categories Table
CREATE TABLE IF NOT EXISTS Categories (
    CategoryID INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Create Recipe_Categories Table
CREATE TABLE IF NOT EXISTS Recipe_Categories (
    RecipeID INT, 
    CategoryID INT, 
    PRIMARY KEY (RecipeID, CategoryID), 
    FOREIGN KEY (RecipeID) REFERENCES Recipes(RecipeID) ON DELETE CASCADE, 
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID) ON DELETE CASCADE
);

-- Create Ingredients Table
CREATE TABLE IF NOT EXISTS Ingredients (
    IngredientID INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(255) NOT NULL
);

-- Create Units Table
CREATE TABLE IF NOT EXISTS Units (
    UnitID INT AUTO_INCREMENT PRIMARY KEY,
    UnitName VARCHAR(50) UNIQUE NOT NULL
);

-- Create Recipe_Ingredients Table
CREATE TABLE IF NOT EXISTS Recipe_Ingredients (
    RecipeID INT, 
    IngredientID INT, 
    Quantity DECIMAL(10, 2) NOT NULL,
    UnitID INT,  -- Reference to the Units table
    PRIMARY KEY (RecipeID, IngredientID), 
    FOREIGN KEY (RecipeID) REFERENCES Recipes(RecipeID) ON DELETE CASCADE, 
    FOREIGN KEY (IngredientID) REFERENCES Ingredients(IngredientID) ON DELETE CASCADE,
    FOREIGN KEY (UnitID) REFERENCES Units(UnitID)
);

-- Create Recipe_Steps Table
CREATE TABLE IF NOT EXISTS Recipe_Steps (
    RecipeID INT, 
    StepOrder INT NOT NULL, 
    Description TEXT NOT NULL, 
    PRIMARY KEY (RecipeID, StepOrder), 
    FOREIGN KEY (RecipeID) REFERENCES Recipes(RecipeID) ON DELETE CASCADE
);

-- What changes did you have to do to normalize your database?
-- Changes made: 
    -- We have created a new Units table to normalize how units stored.
    -- We now have a UnitID stored in units table instead of storing units in Recipe_Ingredients
    -- Simplified the relationship between recipes and steps by eliminating Steps table
    -- Instead we have a Recipe_Steps table and references Recipe and StepOrder
