
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Heart, Clock, Search, Filter } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Recipe {
  id: number;
  name: string;
  description: string;
  image: string;
  prepTime: number;
  cookTime: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  instructions: string[];
  tags: string[];
  favorited: boolean;
}

const Recipes = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [favoritesOnly, setFavoritesOnly]  = useState(false);
  
  // Mock recipe data
  const initialRecipes: Recipe[] = [
    {
      id: 1,
      name: "Greek Yogurt Parfait",
      description: "A protein-packed breakfast that's as nutritious as it is delicious.",
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      prepTime: 5,
      cookTime: 0,
      calories: 320,
      protein: 24,
      carbs: 32,
      fat: 10,
      ingredients: [
        "1 cup Greek yogurt",
        "1/2 cup mixed berries",
        "1 tablespoon honey",
        "2 tablespoons granola"
      ],
      instructions: [
        "Layer half of the yogurt in a glass or bowl.",
        "Add half of the berries on top.",
        "Repeat with remaining yogurt and berries.",
        "Drizzle with honey and sprinkle granola on top."
      ],
      tags: ["breakfast", "vegetarian", "high-protein"],
      favorited: false
    },
    {
      id: 2,
      name: "Grilled Chicken Salad",
      description: "A light and healthy lunch option packed with protein and fresh vegetables.",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      prepTime: 10,
      cookTime: 15,
      calories: 420,
      protein: 35,
      carbs: 25,
      fat: 18,
      ingredients: [
        "6 oz grilled chicken breast",
        "2 cups mixed greens",
        "1/2 cup cherry tomatoes, halved",
        "1/4 cucumber, sliced",
        "1 tablespoon olive oil",
        "1 tablespoon lemon juice",
        "Salt and pepper to taste"
      ],
      instructions: [
        "Season chicken with salt and pepper and grill until cooked through.",
        "Slice chicken and let it cool slightly.",
        "In a large bowl, combine greens, tomatoes, and cucumber.",
        "Whisk together olive oil, lemon juice, salt, and pepper.",
        "Add chicken to the salad and drizzle with dressing."
      ],
      tags: ["lunch", "high-protein", "low-carb"],
      favorited: true
    },
    {
      id: 3,
      name: "Baked Salmon with Quinoa",
      description: "A nutrient-rich dinner that's both heart-healthy and satisfying.",
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      prepTime: 10,
      cookTime: 20,
      calories: 580,
      protein: 42,
      carbs: 48,
      fat: 22,
      ingredients: [
        "6 oz salmon fillet",
        "3/4 cup cooked quinoa",
        "1 cup asparagus spears",
        "1 lemon, sliced",
        "1 tablespoon olive oil",
        "1 clove garlic, minced",
        "Fresh herbs (dill, parsley)",
        "Salt and pepper to taste"
      ],
      instructions: [
        "Preheat oven to 400°F (200°C).",
        "Place salmon on a baking sheet, drizzle with olive oil, and season with salt, pepper, and minced garlic.",
        "Top with lemon slices and herbs.",
        "Bake for 15-20 minutes until salmon flakes easily.",
        "Steam asparagus until tender-crisp.",
        "Serve salmon over quinoa with asparagus on the side."
      ],
      tags: ["dinner", "high-protein", "low-carb"],
      favorited: false
    },
    {
      id: 4,
      name: "Avocado Toast with Egg",
      description: "A trendy but nutritious breakfast that's satisfying and full of healthy fats.",
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      prepTime: 5,
      cookTime: 5,
      calories: 390,
      protein: 22,
      carbs: 38,
      fat: 18,
      ingredients: [
        "2 slices whole grain bread",
        "1 ripe avocado",
        "2 eggs",
        "Cherry tomatoes, halved",
        "Everything bagel seasoning or salt and pepper",
        "Red pepper flakes (optional)"
      ],
      instructions: [
        "Toast the bread until golden brown.",
        "While bread is toasting, cook eggs to your preference (fried or poached works best).",
        "Mash avocado and spread on toast.",
        "Top with eggs, tomatoes, and seasonings."
      ],
      tags: ["breakfast", "vegetarian", "high-protein"],
      favorited: false
    },
    {
      id: 5,
      name: "Protein-Packed Smoothie Bowl",
      description: "A refreshing and nutritious breakfast that's perfect for hot mornings.",
      image: "https://images.unsplash.com/photo-1511690078903-71dc5a49f5e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      prepTime: 10,
      cookTime: 0,
      calories: 380,
      protein: 22,
      carbs: 48,
      fat: 12,
      ingredients: [
        "1 scoop protein powder",
        "1 frozen banana",
        "1/2 cup frozen berries",
        "1/2 cup almond milk",
        "1 tablespoon chia seeds",
        "Toppings: sliced banana, berries, granola, coconut flakes"
      ],
      instructions: [
        "Blend protein powder, frozen banana, berries, and almond milk until smooth but thick.",
        "Pour into a bowl.",
        "Top with additional fruit, granola, coconut flakes, and chia seeds."
      ],
      tags: ["breakfast", "vegetarian", "vegan", "high-protein"],
      favorited: true
    },
    {
      id: 6,
      name: "Chicken Quinoa Bowl",
      description: "A balanced lunch bowl that's as tasty as it is nutritious.",
      image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      prepTime: 15,
      cookTime: 20,
      calories: 450,
      protein: 35,
      carbs: 48,
      fat: 12,
      ingredients: [
        "4 oz grilled chicken breast, diced",
        "3/4 cup cooked quinoa",
        "1/2 cup roasted sweet potatoes",
        "1 cup kale, massaged",
        "2 tablespoons tahini dressing",
        "1 tablespoon lemon juice",
        "Salt and pepper to taste"
      ],
      instructions: [
        "Cook quinoa according to package directions.",
        "Season chicken with salt and pepper and grill until cooked through.",
        "Cube sweet potatoes, toss with olive oil, salt, and pepper, and roast at 400°F for 20 minutes.",
        "Massage kale with a bit of olive oil and lemon juice.",
        "Assemble bowl with quinoa as base, topped with chicken, sweet potatoes, and kale.",
        "Drizzle with tahini dressing."
      ],
      tags: ["lunch", "high-protein", "meal-prep"],
      favorited: false
    },
    {
      id: 7,
      name: "Turkey Lettuce Wraps",
      description: "A low-carb lunch option that doesn't sacrifice flavor.",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      prepTime: 10,
      cookTime: 10,
      calories: 320,
      protein: 28,
      carbs: 10,
      fat: 18,
      ingredients: [
        "8 oz ground turkey",
        "1 tablespoon olive oil",
        "2 cloves garlic, minced",
        "1 small onion, diced",
        "1 red bell pepper, diced",
        "2 tablespoons low-sodium soy sauce",
        "1 tablespoon hoisin sauce",
        "1 teaspoon sesame oil",
        "Large lettuce leaves (Bibb or Romaine)",
        "Chopped peanuts and green onions for garnish"
      ],
      instructions: [
        "Heat olive oil in a pan over medium heat.",
        "Add garlic and onion, sauté until fragrant.",
        "Add ground turkey and cook until browned.",
        "Add bell pepper and cook until slightly softened.",
        "Stir in soy sauce, hoisin sauce, and sesame oil.",
        "Serve in lettuce leaves, topped with peanuts and green onions."
      ],
      tags: ["lunch", "high-protein", "low-carb"],
      favorited: false
    },
    {
      id: 8,
      name: "Mediterranean Chickpea Salad",
      description: "A protein-rich vegetarian lunch that's perfect for meal prep.",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      prepTime: 15,
      cookTime: 0,
      calories: 380,
      protein: 15,
      carbs: 45,
      fat: 16,
      ingredients: [
        "1 can (15 oz) chickpeas, drained and rinsed",
        "1 cucumber, diced",
        "1 cup cherry tomatoes, halved",
        "1/4 red onion, finely diced",
        "1/2 cup feta cheese, crumbled",
        "1/4 cup kalamata olives, pitted and sliced",
        "2 tablespoons olive oil",
        "1 tablespoon lemon juice",
        "1 teaspoon dried oregano",
        "Salt and pepper to taste",
        "Fresh parsley, chopped"
      ],
      instructions: [
        "In a large bowl, combine chickpeas, cucumber, tomatoes, onion, feta, and olives.",
        "In a small bowl, whisk together olive oil, lemon juice, oregano, salt, and pepper.",
        "Pour dressing over salad and toss to combine.",
        "Garnish with fresh parsley before serving."
      ],
      tags: ["lunch", "vegetarian", "meal-prep"],
      favorited: true
    },
    {
      id: 9,
      name: "Baked Cod with Vegetables",
      description: "A light yet satisfying dinner that's packed with protein and nutrients.",
      image: "https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      prepTime: 10,
      cookTime: 20,
      calories: 380,
      protein: 35,
      carbs: 25,
      fat: 15,
      ingredients: [
        "6 oz cod fillet",
        "1 cup mixed vegetables (zucchini, yellow squash, cherry tomatoes)",
        "1 tablespoon olive oil",
        "2 cloves garlic, minced",
        "1 lemon, sliced",
        "Fresh herbs (thyme, parsley)",
        "Salt and pepper to taste"
      ],
      instructions: [
        "Preheat oven to 375°F (190°C).",
        "Place cod and vegetables on a sheet of parchment paper.",
        "Drizzle with olive oil and sprinkle with garlic, herbs, salt, and pepper.",
        "Top with lemon slices and fold parchment paper to create a sealed packet.",
        "Bake for 15-20 minutes until cod flakes easily and vegetables are tender."
      ],
      tags: ["dinner", "high-protein", "low-carb"],
      favorited: false
    },
    {
      id: 10,
      name: "Vegetable Stir Fry with Tofu",
      description: "A colorful and nutritious plant-based dinner that's quick to prepare.",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      prepTime: 15,
      cookTime: 10,
      calories: 350,
      protein: 20,
      carbs: 35,
      fat: 14,
      ingredients: [
        "14 oz firm tofu, pressed and cubed",
        "2 cups mixed vegetables (broccoli, bell peppers, carrots, snap peas)",
        "2 tablespoons sesame oil",
        "2 cloves garlic, minced",
        "1-inch piece ginger, grated",
        "3 tablespoons low-sodium soy sauce",
        "1 tablespoon rice vinegar",
        "1 teaspoon maple syrup or honey",
        "Red pepper flakes (optional)",
        "Sesame seeds for garnish"
      ],
      instructions: [
        "Press tofu to remove excess water, then cut into cubes.",
        "Heat 1 tablespoon sesame oil in a wok or large pan over medium-high heat.",
        "Add tofu and cook until golden brown on all sides. Remove from pan.",
        "Add remaining oil, garlic, and ginger to the pan and cook until fragrant.",
        "Add vegetables and stir-fry until tender-crisp.",
        "In a small bowl, mix soy sauce, rice vinegar, and maple syrup.",
        "Return tofu to the pan, add sauce mixture, and toss to coat.",
        "Garnish with sesame seeds and serve hot."
      ],
      tags: ["dinner", "vegetarian", "vegan"],
      favorited: false
    },
    {
      id: 11,
      name: "Protein Energy Balls",
      description: "Perfect for a pre-workout energy boost or post-workout recovery.",
      image: "https://images.unsplash.com/photo-1490567674331-72de84996caa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      prepTime: 15,
      cookTime: 0,
      calories: 220,
      protein: 8,
      carbs: 18,
      fat: 14,
      ingredients: [
        "1 cup rolled oats",
        "1/2 cup natural peanut butter",
        "1/4 cup honey or maple syrup",
        "1/4 cup ground flaxseed",
        "1/4 cup protein powder",
        "1/4 cup mini dark chocolate chips",
        "1 teaspoon vanilla extract",
        "Pinch of salt"
      ],
      instructions: [
        "In a large bowl, mix all ingredients until well combined.",
        "Cover and refrigerate for 30 minutes to make the mixture easier to handle.",
        "Roll into 1-inch balls.",
        "Store in an airtight container in the refrigerator for up to a week."
      ],
      tags: ["snack", "vegetarian", "high-protein", "meal-prep"],
      favorited: false
    },
    {
      id: 12,
      name: "Overnight Oats",
      description: "A time-saving breakfast that can be prepared the night before.",
      image: "https://images.unsplash.com/photo-1455099229380-7b52707e084a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      prepTime: 5,
      cookTime: 0,
      calories: 340,
      protein: 18,
      carbs: 45,
      fat: 10,
      ingredients: [
        "1/2 cup rolled oats",
        "1/2 cup almond milk",
        "1/4 cup Greek yogurt",
        "1 scoop protein powder (optional)",
        "1 tablespoon chia seeds",
        "1 tablespoon honey or maple syrup",
        "1/2 banana, sliced",
        "1 tablespoon peanut butter",
        "Cinnamon to taste"
      ],
      instructions: [
        "In a jar or container, combine oats, almond milk, Greek yogurt, protein powder, chia seeds, and sweetener.",
        "Stir well to combine.",
        "Cover and refrigerate overnight or for at least 4 hours.",
        "Before serving, top with banana slices, peanut butter, and a sprinkle of cinnamon."
      ],
      tags: ["breakfast", "vegetarian", "high-protein", "meal-prep"],
      favorited: true
    }
  ];
  
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  
  const handleFavoriteToggle = (id: number) => {
    const updatedRecipes = recipes.map(recipe => 
      recipe.id === id ? { ...recipe, favorited: !recipe.favorited } : recipe
    );
    setRecipes(updatedRecipes);
    
    const recipe = recipes.find(r => r.id === id);
    if (recipe) {
      toast({
        title: recipe.favorited ? "Removed from favorites" : "Added to favorites",
        description: `${recipe.name} has been ${recipe.favorited ? "removed from" : "added to"} your favorites.`,
      });
    }
  };
  
  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleToggleFavorites = () => {
    setFavoritesOnly(!favoritesOnly);
  };
  
  // Filter recipes based on search query, selected tab, and favorites
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTab = activeTab === "all" || recipe.tags.includes(activeTab);
    
    const matchesFavorites = favoritesOnly ? recipe.favorited : true;
    
    return matchesSearch && matchesTab && matchesFavorites;
  });
  
  // Group recipes by meal type for better organization
  const recipesByMealType: Record<string, Recipe[]> = {
    breakfast: filteredRecipes.filter(recipe => recipe.tags.includes("breakfast")),
    lunch: filteredRecipes.filter(recipe => recipe.tags.includes("lunch")),
    dinner: filteredRecipes.filter(recipe => recipe.tags.includes("dinner")),
    snack: filteredRecipes.filter(recipe => recipe.tags.includes("snack"))
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Recipe Library</h1>
            <p className="text-muted-foreground">Discover healthy recipes tailored to your fitness goals</p>
          </div>
          <Button onClick={() => {
            toast({
              title: "Generating recipes",
              description: "AI is creating new recipes based on your preferences",
            });
          }}>
            Generate New Recipes
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search recipes..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <Button
            variant={favoritesOnly ? "default" : "outline"}
            onClick={handleToggleFavorites}
            className="shrink-0"
          >
            <Heart className={`mr-2 h-4 w-4 ${favoritesOnly ? "fill-current" : ""}`} />
            {favoritesOnly ? "Showing Favorites" : "Show Favorites"}
          </Button>
          <Button variant="outline" className="shrink-0">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Recipes</TabsTrigger>
            <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
            <TabsTrigger value="lunch">Lunch</TabsTrigger>
            <TabsTrigger value="dinner">Dinner</TabsTrigger>
            <TabsTrigger value="high-protein">High Protein</TabsTrigger>
            <TabsTrigger value="vegetarian">Vegetarian</TabsTrigger>
            <TabsTrigger value="low-carb">Low Carb</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {filteredRecipes.length > 0 ? (
              <div className="space-y-8">
                {Object.entries(recipesByMealType).map(([mealType, recipes]) => 
                  recipes.length > 0 && (
                    <div key={mealType}>
                      <h2 className="text-xl font-semibold mb-4 capitalize">{mealType} Recipes</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recipes.map(recipe => renderRecipeCard(recipe))}
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No recipes found matching your criteria.</p>
              </div>
            )}
          </TabsContent>
          
          {["breakfast", "lunch", "dinner", "high-protein", "vegetarian", "low-carb"].map(tag => (
            <TabsContent key={tag} value={tag}>
              {filteredRecipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRecipes.map(recipe => renderRecipeCard(recipe))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No {tag} recipes found matching your criteria.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
        
        {/* Recipe Detail Dialog */}
        <Dialog open={selectedRecipe !== null} onOpenChange={() => setSelectedRecipe(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
            {selectedRecipe && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedRecipe.name}</DialogTitle>
                  <DialogDescription>{selectedRecipe.description}</DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                  <div>
                    <div 
                      className="w-full h-60 rounded-md bg-cover bg-center"
                      style={{ backgroundImage: `url(${selectedRecipe.image})` }}
                    ></div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Prep Time</p>
                        <p className="font-medium">{selectedRecipe.prepTime} minutes</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Cook Time</p>
                        <p className="font-medium">{selectedRecipe.cookTime} minutes</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Calories</p>
                        <p className="font-medium">{selectedRecipe.calories}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Total Time</p>
                        <p className="font-medium">{selectedRecipe.prepTime + selectedRecipe.cookTime} minutes</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-4 border rounded-md">
                      <h3 className="font-semibold mb-2">Nutrition Facts</h3>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Protein</p>
                          <p className="font-medium">{selectedRecipe.protein}g</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Carbs</p>
                          <p className="font-medium">{selectedRecipe.carbs}g</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Fat</p>
                          <p className="font-medium">{selectedRecipe.fat}g</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedRecipe.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
                        <ul className="space-y-2">
                          {selectedRecipe.ingredients.map((ingredient, index) => (
                            <li key={index} className="flex items-start">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2" />
                              <span>{ingredient}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="border-t pt-4">
                        <h3 className="text-lg font-semibold mb-2">Instructions</h3>
                        <ol className="space-y-3">
                          {selectedRecipe.instructions.map((instruction, index) => (
                            <li key={index} className="flex">
                              <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 shrink-0 mt-0.5">
                                {index + 1}
                              </span>
                              <span>{instruction}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => handleFavoriteToggle(selectedRecipe.id)}
                  >
                    <Heart 
                      className={`mr-2 h-4 w-4 ${selectedRecipe.favorited ? "fill-current text-red-500" : ""}`} 
                    />
                    {selectedRecipe.favorited ? "Remove from Favorites" : "Add to Favorites"}
                  </Button>
                  <Button onClick={() => {
                    toast({
                      title: "Recipe added to meal plan",
                      description: `${selectedRecipe.name} has been added to your meal plan.`,
                    });
                  }}>
                    Add to Meal Plan
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
  
  function renderRecipeCard(recipe: Recipe) {
    return (
      <Card key={recipe.id} className="overflow-hidden">
        <div 
          className="w-full h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${recipe.image})` }}
        ></div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle>{recipe.name}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                handleFavoriteToggle(recipe.id);
              }}
            >
              <Heart className={`h-5 w-5 ${recipe.favorited ? "fill-current text-red-500" : ""}`} />
              <span className="sr-only">Favorite</span>
            </Button>
          </div>
          <CardDescription>{recipe.description}</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex justify-between text-sm">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{recipe.prepTime + recipe.cookTime} min</span>
            </div>
            <div>
              <span className="font-medium">{recipe.calories}</span> calories
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {recipe.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{recipe.tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => handleRecipeClick(recipe)}>
            View Recipe
          </Button>
        </CardFooter>
      </Card>
    );
  }
};

export default Recipes;
