import React, { useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import Style from '../../assets/Style';
import { addIngredients, addRecipe, removeIngredients, removeRecipe } from '../redux/action';
import { SearchBar } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Text, View, ScrollView, ActivityIndicator, SafeAreaView, StatusBar } from 'react-native';


export default function Searching() {

    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [searchTimer, setSearchTimer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [apistatus, setApiStatus] = useState(false);
    const info = 'fillIngredients=true&addRecipeInformation=true&instructionsRequired=true'
    const API_KEY = 'your-api-key'
    
    const navigation = useNavigation();

    async function fetchData(text) {
        try {
        const res = await fetch(
            `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${text}&${info}&number=10`,
        );

        if (res.status === 200) {
        res
            .json()
            .then((res) => {
                setResponse(res);
                setLoading(false)
        })}
        else if (res.status !== 200) {
            setLoading(false);
            setApiStatus(true);
        }
        }
            catch(err) {
                console.log(err);
            }
    };

    const dispatch = useDispatch();

    const favourites = useSelector(state => state.favourites);

    const ingredients = useSelector(state => state.ingredients);

    const handleAddRecipe = (recipe) => {
        dispatch(addRecipe(recipe))
    };

    const handleRemoveRecipe = (recipe) => {
        dispatch(removeRecipe(recipe))
    };

    const handleAddIngredients = (ingredients) => {
        dispatch(addIngredients(ingredients))

    };

    const handleRemoveIngredients = (ingredients) => {
        dispatch(removeIngredients(ingredients))
    };

    const recipeExists = recipe => {
        if (favourites?.filter(item => item.id === recipe.id).length > 0) {
            return true;
        }
        return false
    };

    const ingredientsExists = recipe => {
        if (ingredients?.filter(item => item.id === recipe.id).length > 0) {
            return true;
        }
        return false
    };

    return (

        <SafeAreaView style={Style.containerSearch}>
            <View>
                <StatusBar style='dark'/>
                <SearchBar
                    placeholder="Search for recipes"
                    onChangeText={(text) => {
                        if (searchTimer) {
                            clearTimeout(searchTimer);
                        }
                        setLoading(true);
                        setInput(text);
                        setSearchTimer(
                            setTimeout(() => {
                                fetchData(text);
                            }, 3000),
                        );
                    }}
                    value={input}
                    containerStyle={Style.searchContainer}
                    inputContainerStyle={Style.searchInputContainer}
                    inputStyle={Style.searchInput}
                    onSubmitEditing={()=>setInput('')}
                    clearIcon={false}
                    onFocus={()=>setResponse('')}
                />
            </View>

            {loading === true &&
                <View style={Style.myloader}>
                    <ActivityIndicator size='large' color='#FFB3BA' />
                </View>}
            {response.totalResults === 0 &&
                <View style={Style.container}>
                    <Text style={Style.textInstructions}>No results found.</Text>
                </View>
            }
            {apistatus &&
                <View style={Style.container}>
                    <Text style={Style.textInstructions}>Unable to fetch the results. Please try again later.</Text>
                </View>

            }
            {!! response &&
                <View style={Style.container}>
                        <ScrollView contentContainerStyle={Style.containerRecipeCards} showsHorizontalScrollIndicator={false}>
                        {response?.results.map((result) => (
                            <RecipeCard title={result.title} 
                                cookingTime={result.readyInMinutes} 
                                servings={result.servings} 
                                key={result.id}
                                isClicked={recipeExists(result)}
                                isClicked2={ingredientsExists(result)}
                                onPress1={() => navigation.navigate("Recipe", { paramKey: result })} 
                                onPress2={() => {recipeExists(result) ? handleRemoveRecipe(result) : handleAddRecipe(result)}}
                                onPress3={() => {ingredientsExists(result) ? handleRemoveIngredients(result) : handleAddIngredients(result)}}
                                />
                        ))}
                    </ScrollView>
                </View>}
        </SafeAreaView>
    );
}

