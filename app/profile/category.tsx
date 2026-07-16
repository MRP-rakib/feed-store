import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

interface Category {
  id: string;
  name: string;
}

interface SubCategory {
  id: string;
  categoryId: string; 
  name: string;       
  price: string;
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([
    { id: 'cat_1', name: 'Cow' },
    { id: 'cat_2', name: 'Chicken' },
    { id: 'cat_3', name: 'Duck' },
  ]);

  const [subCategories, setSubCategories] = useState<SubCategory[]>([
    { id: 'sub_1', categoryId: 'cat_1', name: 'Layer Feed', price: '45.00' },
    { id: 'sub_2', categoryId: 'cat_2', name: 'Broiler Starter', price: '52.50' },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [newCategoryInput, setNewCategoryInput] = useState<string>('');
  const [subCategoryInput, setSubCategoryInput] = useState<string>('');
  const [priceInput, setPriceInput] = useState<string>('');
  const [editingSubCategoryId, setEditingSubCategoryId] = useState<string | null>(null);

  const handleAddCategory = (): void => {
    if (!newCategoryInput.trim()) {
      Alert.alert('Error', 'Please enter a dynamic category name.');
      return;
    }

    const exists = categories.some(
      cat => cat.name.toLowerCase() === newCategoryInput.trim().toLowerCase()
    );
    if (exists) {
      Alert.alert('Error', 'This category already exists.');
      return;
    }

    const newCat: Category = {
      id: `cat_${Date.now()}`,
      name: newCategoryInput.trim(),
    };

    setCategories(prev => [...prev, newCat]);
    setNewCategoryInput('');
    Alert.alert('Success', `"${newCat.name}" category added successfully!`);
  };

  const handleSelectCategory = (category: Category): void => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
    setSubCategoryInput('');
    setPriceInput('');
    setEditingSubCategoryId(null);
  };

  const handleAddOrUpdateSubCategory = (): void => {
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a Category first from the dropdown.');
      return;
    }
    if (!subCategoryInput.trim()) {
      Alert.alert('Error', 'Please enter a Subcategory (Feed Type) name.');
      return;
    }
    if (!priceInput.trim() || isNaN(Number(priceInput))) {
      Alert.alert('Error', 'Please enter a valid price.');
      return;
    }

    if (editingSubCategoryId) {
      setSubCategories(prev =>
        prev.map(sub =>
          sub.id === editingSubCategoryId
            ? { ...sub, name: subCategoryInput.trim(), price: priceInput.trim() }
            : sub
        )
      );
      setEditingSubCategoryId(null);
    } else {
      const newSubCategory: SubCategory = {
        id: Date.now().toString(),
        categoryId: selectedCategory.id,
        name: subCategoryInput.trim(),
        price: priceInput.trim(),
      };
      setSubCategories(prev => [...prev, newSubCategory]);
    }

    setSubCategoryInput('');
    setPriceInput('');
  };

  const handleEditSubCategory = (subCat: SubCategory): void => {
    setSubCategoryInput(subCat.name);
    setPriceInput(subCat.price);
    setEditingSubCategoryId(subCat.id);
  };

  const handleDeleteSubCategory = (id: string): void => {
    setSubCategories(prev => prev.filter(sub => sub.id !== id));
    if (editingSubCategoryId === id) {
      setEditingSubCategoryId(null);
      setSubCategoryInput('');
      setPriceInput('');
    }
  };

  const activeSubCategories = selectedCategory
    ? subCategories.filter(sub => sub.categoryId === selectedCategory.id)
    : [];

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-slate-50">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
            className="p-6"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
          >
            <View className="mb-6 mt-2">
              <Text className="text-2xl font-bold text-slate-900">Feed & Category Management</Text>
              <Text className="text-sm text-slate-500 mt-1">
                Manage main content categories and configure subcategory pricing models.
              </Text>
            </View>

            <View className="mb-6 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm shadow-slate-100">
              <Text className="text-sm font-semibold text-slate-700 mb-2">Create Main Category</Text>
              <View className="flex-row space-x-2">
                <TextInput
                  placeholder="e.g. Goat, Sheep, Fish"
                  placeholderTextColor="#94a3b8"
                  value={newCategoryInput}
                  onChangeText={(text: string) => setNewCategoryInput(text)}
                  className="flex-1 h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-base text-slate-900"
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleAddCategory}
                  className="px-5 bg-green-600 rounded-xl justify-center items-center shadow-sm active:bg-green-700"
                >
                  <Text className="text-sm font-bold text-white">Add Category</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="mb-6 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm shadow-slate-100 relative" style={{ zIndex: 999 }}>
              <Text className="text-sm font-semibold text-slate-700 mb-2">Select Main Category</Text>
              
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl flex-row items-center justify-between"
              >
                <Text className={`text-base ${selectedCategory ? 'text-slate-990' : 'text-slate-400'}`}>
                  {selectedCategory ? selectedCategory.name : 'Choose a dynamic category'}
                </Text>
                <Text className="text-slate-400 font-bold">{isDropdownOpen ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {isDropdownOpen && (
                <View className="absolute top-[84px] left-5 right-5 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200 overflow-hidden" style={{ zIndex: 1000 }}>
                  <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 200 }} keyboardShouldPersistTaps="handled">
                    {categories.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        onPress={() => handleSelectCategory(item)}
                        className="w-full px-4 py-3 border-b border-slate-50 last:border-b-0 active:bg-slate-50"
                      >
                        <Text className="text-base text-slate-700 font-medium">{item.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {selectedCategory ? (
              <View className="mb-6 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm shadow-slate-100">
                <Text className="text-base font-bold text-slate-800 mb-3">
                  {editingSubCategoryId ? `Update Subcategory for ${selectedCategory.name}` : `Add Subcategory to ${selectedCategory.name}`}
                </Text>
                
                <View className="mb-3">
                  <Text className="text-xs font-semibold text-slate-600 mb-1">Subcategory (Feed Type)</Text>
                  <TextInput
                    placeholder="e.g. Starter Feed, Growing Feed"
                    placeholderTextColor="#94a3b8"
                    value={subCategoryInput}
                    onChangeText={(text: string) => setSubCategoryInput(text)}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-base text-slate-900"
                  />
                </View>

                <View className="mb-4">
                  <Text className="text-xs font-semibold text-slate-600 mb-1">Price per KG ($)</Text>
                  <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-4 h-11">
                    <Text className="text-base text-slate-400 mr-1">$</Text>
                    <TextInput
                      placeholder="0.00"
                      placeholderTextColor="#94a3b8"
                      keyboardType="decimal-pad"
                      value={priceInput}
                      onChangeText={(text: string) => setPriceInput(text)}
                      className="flex-1 h-full text-base text-slate-900"
                    />
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleAddOrUpdateSubCategory}
                  className="w-full h-11 bg-green-600 rounded-xl justify-center items-center shadow-sm active:bg-green-700"
                >
                  <Text className="text-base font-bold text-white">
                    {editingSubCategoryId ? 'Update Subcategory' : 'Save Subcategory'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}

            <View className="p-5 bg-slate-100/90 border border-slate-200 rounded-2xl">
              <Text className="text-base font-bold text-slate-800 mb-1">
                {selectedCategory ? `${selectedCategory.name} Subcategories` : 'Subcategories List'}
              </Text>
              <Text className="text-xs text-slate-500 mb-4">
                {selectedCategory ? `Showing feed models assigned to ${selectedCategory.name}` : 'Please select a main category to filter results.'}
              </Text>

              <View style={{ gap: 8 }}>
                {selectedCategory && activeSubCategories.map((item) => (
                  <View 
                    key={item.id} 
                    className="flex-row items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-200/60 shadow-xs"
                  >
                    <View className="flex-1 pr-2">
                      <Text className="text-base text-slate-800 font-semibold">{item.name}</Text>
                      <Text className="text-sm text-slate-700 font-medium mt-0.5">${item.price}</Text>
                    </View>
                    
                    <View className="flex-row space-x-2">
                      <TouchableOpacity 
                        onPress={() => handleEditSubCategory(item)}
                        className="px-3 py-1.5 bg-blue-50 rounded-lg"
                      >
                        <Text className="text-xs font-bold text-blue-600">Edit</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        onPress={() => handleDeleteSubCategory(item.id)}
                        className="px-3 py-1.5 bg-red-50 rounded-lg"
                      >
                        <Text className="text-xs font-bold text-red-500">Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}

                {selectedCategory && activeSubCategories.length === 0 && (
                  <Text className="text-sm text-slate-400 text-center py-6 bg-white rounded-xl border border-dashed border-slate-300">
                    No subcategories found for {selectedCategory.name}. Add one above!
                  </Text>
                )}

                {!selectedCategory && (
                  <Text className="text-sm text-slate-400 text-center py-6 bg-white rounded-xl border border-dashed border-slate-300">
                    Choose a main category from dropdown to view configurations.
                  </Text>
                )}
              </View>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}