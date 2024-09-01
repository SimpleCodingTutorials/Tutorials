const apiKey = '123456789';

async function searchRecipes() {
    const searchQuery = document.getElementById('query').value;
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${searchQuery}`);
        const data = await response.json();
        const recipeList = document.getElementById('results');
        recipeList.innerHTML = '';
        if (data.results.length === 0) {
            recipeList.innerHTML = 'No recipes found.';
        } else {
            data.results.forEach(recipe => {
                const recipeItem = document.createElement('div');
                recipeItem.className = 'recipe-item';
                const recipeTitle = document.createElement('h3');
                recipeTitle.textContent = recipe.title;
                const recipeImage = document.createElement('img');
                recipeImage.src = recipe.image;
                recipeImage.alt = recipe.title;
                const recipeLink = document.createElement('a');
                recipeLink.href = '#';
                recipeLink.textContent = 'View Recipe';
                recipeLink.onclick = async function() {
                    await showRecipeDetails(recipe.id);
                };
                recipeItem.appendChild(recipeImage);
                recipeItem.appendChild(recipeTitle);
                recipeItem.appendChild(recipeLink);
                recipeList.appendChild(recipeItem);
            });
        }
    } catch(error) {
        console.error("Error fetching recipes:",error);
    }
}
async function showRecipeDetails(recipeId) {
    const recipeDetailsDiv = document.getElementById("recipe-details");
    const recipeContentDiv = document.getElementById("recipe-content");
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`);
        const recipeData = await response.json();
        recipeContentDiv.innerHTML =`
            <h2>${recipeData.title}</h2>
            <img src="${recipeData.image}" alt="${recipeData.title}">
            <p><strong>Ingredients:</strong> ${recipeData.extendedIngredients.map(ingredient=>ingredient.original).join(', ')}</p>
            <p><strong>Instructions:</strong> ${recipeData.instructions}</p>
        `;
        recipeDetailsDiv.style.display = "flex";
    } catch (error) {
        console.error("Error fetching recipe details:", error);
    }
}

function closeRecipeDetails() {
    const recipeDetailsDiv = document.getElementById("recipe-details");
    recipeDetailsDiv.style.display = "none";
}


















