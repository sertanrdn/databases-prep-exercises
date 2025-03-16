import mysql from 'mysql2/promise';

async function setupDatabase() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'hyfuser',
        password: 'hyfpassword',
        multipleStatements: true
    });

    const createDatabase = `
        DROP DATABASE IF EXISTS recipes_db;
        CREATE DATABASE recipes_db;
    `;
    const useDatabase = `USE recipes_db;`;

    const createRecipe = `CREATE TABLE IF NOT EXISTS Recipes (
        RecipeID INT AUTO_INCREMENT PRIMARY KEY, 
        name VARCHAR(255) UNIQUE NOT NULL
    );`;

    const createCategories = `CREATE TABLE IF NOT EXISTS Categories (
        CategoryID INT AUTO_INCREMENT PRIMARY KEY, 
        name VARCHAR(255) UNIQUE NOT NULL
    );`; 

    const createRecipeCategory = `CREATE TABLE IF NOT EXISTS Recipe_Categories (
        RecipeID INT, 
        CategoryID INT, 
        PRIMARY KEY (RecipeID, CategoryID), 
        FOREIGN KEY (RecipeID) REFERENCES Recipes(RecipeID) ON DELETE CASCADE, 
        FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID) ON DELETE CASCADE
    );`;

    const createIngredients = `CREATE TABLE IF NOT EXISTS Ingredients (
        IngredientID INT AUTO_INCREMENT PRIMARY KEY, 
        name VARCHAR(255) NOT NULL
    );`;

    const createRecipeIngredients = `CREATE TABLE IF NOT EXISTS Recipe_Ingredients (
        RecipeID INT, 
        IngredientID INT, 
        Quantity VARCHAR(100), 
        PRIMARY KEY (RecipeID, IngredientID), 
        FOREIGN KEY (RecipeID) REFERENCES Recipes(RecipeID) ON DELETE CASCADE, 
        FOREIGN KEY (IngredientID) REFERENCES Ingredients(IngredientID) ON DELETE CASCADE
    );`;

    const createSteps = `CREATE TABLE IF NOT EXISTS Steps (
        StepID INT AUTO_INCREMENT PRIMARY KEY, 
        Description TEXT NOT NULL
    );`;

    const createRecipeSteps = `CREATE TABLE IF NOT EXISTS Recipe_Steps (
        RecipeID INT, 
        StepID INT, 
        StepOrder INT NOT NULL, 
        PRIMARY KEY (RecipeID, StepID), 
        FOREIGN KEY (RecipeID) REFERENCES Recipes(RecipeID) ON DELETE CASCADE, 
        FOREIGN KEY (StepID) REFERENCES Steps(StepID) ON DELETE CASCADE
    );`;

    await connection.query(createDatabase);
    await connection.query(useDatabase);
    await connection.query(createRecipe);
    await connection.query(createCategories);
    await connection.query(createRecipeCategory);
    await connection.query(createIngredients);
    await connection.query(createRecipeIngredients);
    await connection.query(createSteps);
    await connection.query(createRecipeSteps);

    const insertRecipeData = `INSERT INTO Recipes (name) VALUES 
        ('No-Bake Cheesecake'), ('Roasted Brussels Sprouts'), 
        ('Mac & Cheese'), ('Tamagoyaki Japanese Omelette');
    `;

    const insertCategoryData = `INSERT INTO Categories (name) VALUES 
        ('Cake'), ('No-Bake'), ('Vegetarian'), 
        ('Vegan'), ('Gluten-Free'), ('Japanese');
    `;

    const insertRecipeCategoryData = `INSERT INTO Recipe_Categories (RecipeID, CategoryID) VALUES
        (1, 1), (1, 2), (1, 3), (2, 4),
        (2, 5), (3, 3), (4, 3), (4, 6);
    `;

    const insertIngredientsData = `INSERT INTO Ingredients (name) VALUES
        ('Condensed milk'), ('Cream Cheese'), ('Lemon Juice'), ('Pie Crust'),
        ('Cherry Jam'), ('Brussels Sprouts'), ('Sesame seeds'), ('Pepper'),
        ('Salt'), ('Olive Oil'), ('Macaroni'), ('Butter'), ('Flour'), ('Milk'), 
        ('Shredded Cheddar cheese'), ('Eggs'), ('Soy sauce'), ('Sugar');
    `;

    const insertRecipeIngredientsData = `INSERT INTO Recipe_Ingredients (RecipeID, IngredientID) VALUES
        (1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (2, 6),
        (2, 3), (2, 7), (2, 8), (2, 9), (2, 10), (3, 11),
        (3, 12), (3, 13), (3, 9), (3, 8), (3, 14), (3, 15),
        (4, 16), (4, 17), (4, 18), (4, 9), (4, 10);
    `;

    const insertStepsData = `INSERT INTO Steps (description) VALUES
        ('Beat Cream Cheese'), ('Add condensed Milk and blend'),
        ('Add Lemon Juice and blend'), ('Add the mix to the pie crust'),
        ('Spread the Cherry Jam'), ('Place in refrigerator for 3h'),
        ('Preheat the oven'), ('Mix the ingredients in a bowl'),
        ('Spread the mix on baking sheet'), ('Bake for 30 minutes'),
        ('Cook Macaroni for 8 minutes'), ('Melt butter in a saucepan'),
        ('Add flour, salt, pepper and mix'), ('Add Milk and mix'),
        ('Cook until mix is smooth'), ('Add cheddar cheese'),
        ('Add the macaroni'), ('Beat the eggs'),
        ('Add soya sauce, sugar and salt'), ('Add oil to a sauce pan'),
        ('Bring to medium heat'), ('Add some mix to the sauce pan'),
        ('Let it cook for 1 minute'), ('Remove pan from fire');
    `;

    const insertRecipeStepsData = `INSERT INTO Recipe_Steps (RecipeID, StepID, StepOrder) VALUES
        (1, 1, 1), (1, 2, 2), (1, 3, 3), (1, 4, 4), (1, 5, 5), (1, 6, 6), 
        (2, 7, 1), (2, 8, 2), (2, 9, 3), (2, 10, 4), (3, 11, 1), (3, 12, 2), 
        (3, 13, 3), (3, 14, 4), (3, 15, 5), (3, 16, 6), (3, 17, 7), (4, 18, 1), 
        (4, 19, 2), (4, 20, 3), (4, 21, 4), (4, 22, 5), (4, 23, 6), (4, 24, 7);
    `;

    await connection.query(insertRecipeData);
    await connection.query(insertCategoryData);
    await connection.query(insertRecipeCategoryData);
    await connection.query(insertIngredientsData);
    await connection.query(insertRecipeIngredientsData);
    await connection.query(insertStepsData);
    await connection.query(insertRecipeStepsData);

    const vegetarianMeals = async() => {
        const query =  `SELECT Recipes.name FROM Recipes
            JOIN Recipe_Categories ON Recipes.RecipeID = Recipe_Categories.RecipeID
            JOIN Categories ON Recipe_Categories.CategoryID = Categories.CategoryID
            JOIN Recipe_Ingredients ON Recipes.RecipeID = Recipe_Ingredients.RecipeID
            JOIN Ingredients ON Recipe_Ingredients.IngredientID = Ingredients.IngredientID
            WHERE Categories.name = 'Vegetarian';   
        `;

        const [rows] = await connection.query(query);
        console.log('All the vegetarian recipes: ', rows);
    }

    const noBakeCake = async() => {
        const query = `SELECT Recipes.name FROM Recipes
            JOIN Recipe_Categories ON Recipes.RecipeID = Recipe_Categories.RecipeID
            JOIN Categories ON Recipe_Categories.CategoryID = Categories.CategoryID
            WHERE Categories.name = 'Cake'
            AND Recipes.RecipeID IN (
                SELECT Recipe_Categories.RecipeID
                FROM Recipe_Categories
                JOIN Categories ON Recipe_Categories.CategoryID = Categories.CategoryID
                WHERE Categories.name = 'No-Bake'    
            );
        `;

        const [rows] = await connection.query(query);
        console.log('All the Cakes that do not need baking: ', rows);
    }

    const vegetarianJapanese = async() => {
        const query = `SELECT Recipes.name FROM Recipes
            JOIN Recipe_Categories ON Recipes.RecipeID = Recipe_Categories.RecipeID
            JOIN Categories ON Recipe_Categories.CategoryID = Categories.CategoryID
            WHERE Categories.name = 'Vegetarian'
            AND Recipes.RecipeID IN (
                SELECT Recipe_Categories.RecipeID
                FROM Recipe_Categories
                JOIN Categories ON Recipe_Categories.CategoryID = Categories.CategoryID
                WHERE Categories.name = 'Japanese'
            );
        `;

        const [rows] = await connection.query(query);
        console.log('All the vegan and Japanese recipes: ', rows);
    }

    await vegetarianMeals();
    await noBakeCake();
    await vegetarianJapanese();

    connection.end();
}

setupDatabase();