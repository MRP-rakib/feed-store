import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Platform 
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

// ১. ড্রপডাউনের জন্য প্রপস টাইপ ইন্টারফেস
interface SimpleSelectProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (selectedOption: string) => void;
}

// ড্রপডাউন কম্পোনেন্ট
function SimpleSelect({ label, value, options, onSelect }: SimpleSelectProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <View className="mb-4">
      <Text className="text-gray-600 font-semibold mb-1 text-[15px]">{label}</Text>
      <TouchableOpacity 
        onPress={() => setIsOpen(!isOpen)} 
        className="flex-row justify-between items-center bg-white border border-gray-300 rounded-lg p-3"
      >
        <Text className="text-gray-800 text-[16px]">{value}</Text>
        <Text className="text-gray-500">▼</Text>
      </TouchableOpacity>
      {isOpen && (
        <View className="bg-white border border-gray-200 rounded-lg mt-1 overflow-hidden shadow-md">
          {options.map((opt: string) => (
            <TouchableOpacity 
              key={opt} 
              className="p-3 border-b border-gray-100 last:border-b-0"
              onPress={() => {
                onSelect(opt);
                setIsOpen(false);
              }}
            >
              <Text className="text-gray-700">{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

export default function FeedEntryForm() {
  // ২. স্টেট ডেফিনিশন (Strict Typing)
  const [date, setDate] = useState<Date>(new Date('2025-07-10'));
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const [category, setCategory] = useState<string>('মুরগির খাবার');
  const [supplier, setSupplier] = useState<string>('Amin Feed Mills');

  const [totalBags, setTotalBags] = useState<string>('50');
  const [pricePerBag, setPricePerBag] = useState<string>('2500');
  const [transportCost, setTransportCost] = useState<string>('3000');
  const [otherCost, setOtherCost] = useState<string>('500');
  const [note, setNote] = useState<string>('');

  const [totalFeedCost, setTotalFeedCost] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);

  // ৩. লাইভ ক্যালকুলেশন এফেক্ট
  useEffect(() => {
    const bags: number = parseFloat(totalBags) || 0;
    const price: number = parseFloat(pricePerBag) || 0;
    const transport: number = parseFloat(transportCost) || 0;
    const other: number = parseFloat(otherCost) || 0;

    const feedCost: number = bags * price;
    setTotalFeedCost(feedCost);
    setGrandTotal(feedCost + transport + other);
  }, [totalBags, pricePerBag, transportCost, otherCost]);

  // ৪. টাকা ফরম্যাটিং ফাংশন টাইপিং
  const formatBanglaNumber = (num: number): string => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  // ৫. ডেটপিকার ইভেন্ট হ্যান্ডলার টাইপিং
  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date): void => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSave = (): void => {
    alert('Entry Saved Successfully!');
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 py-6">
      
      {/* তারিখ ফিল্ড */}
      <View className="mb-4">
        <Text className="text-gray-600 font-semibold mb-1 text-[15px]">তারিখ</Text>
        <TouchableOpacity 
          onPress={() => setShowDatePicker(true)}
          className="flex-row justify-between items-center bg-white border border-gray-300 rounded-lg p-3"
        >
          <Text className="text-gray-800 text-[16px]">
            {date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </Text>
          <Text className="text-gray-500">📅</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>

      {/* ক্যাটাগরি */}
      <SimpleSelect 
        label="ক্যাটাগরি" 
        value={`🐔 ${category}`} 
        options={['মুরগির খাবার', 'মাছের খাবার', 'অন্যান্য']} 
        onSelect={(val: string) => setCategory(val.replace('🐔 ', ''))}
      />

      {/* সরবরাহকারী */}
      <SimpleSelect 
        label="সরবরাহকারী" 
        value={supplier} 
        options={['Amin Feed Mills', 'Kazi Farms', 'CP Bangladesh']} 
        onSelect={(val: string) => setSupplier(val)}
      />

      {/* মোট বস্তা এবং প্রতি বস্তার দাম */}
      <View className="flex-row gap-4 mb-4">
        <View className="flex-1">
          <Text className="text-gray-600 font-semibold mb-1 text-[15px]">মোট বস্তা</Text>
          <TextInput
            keyboardType="numeric"
            value={totalBags}
            onChangeText={(text: string) => setTotalBags(text)}
            className="bg-white border border-gray-300 rounded-lg p-3 text-gray-800 text-[16px]"
          />
        </View>
        <View className="flex-1">
          <Text className="text-gray-600 font-semibold mb-1 text-[15px]">প্রতি বস্তার দাম (৳)</Text>
          <TextInput
            keyboardType="numeric"
            value={pricePerBag}
            onChangeText={(text: string) => setPricePerBag(text)}
            className="bg-white border border-gray-300 rounded-lg p-3 text-gray-800 text-[16px]"
          />
        </View>
      </View>

      {/* খাবারের মোট দাম */}
      <View className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 mb-4">
        <Text className="text-emerald-800 font-semibold text-[14px]">খাবারের মোট দাম (৳)</Text>
        <Text className="text-emerald-950 font-bold text-[22px] mt-1">
          ৳ {formatBanglaNumber(totalFeedCost)}
        </Text>
      </View>

      {/* গাড়ি ভাড়া */}
      <View className="mb-4">
        <Text className="text-gray-600 font-semibold mb-1 text-[15px]">গাড়ি ভাড়া (৳)</Text>
        <TextInput
          keyboardType="numeric"
          value={transportCost}
          onChangeText={(text: string) => setTransportCost(text)}
          className="bg-white border border-gray-300 rounded-lg p-3 text-gray-800 text-[16px]"
        />
      </View>

      {/* অন্যান্য খরচ */}
      <View className="mb-4">
        <Text className="text-gray-600 font-semibold mb-1 text-[15px]">অন্যান্য খরচ (৳)</Text>
        <TextInput
          keyboardType="numeric"
          value={otherCost}
          onChangeText={(text: string) => setOtherCost(text)}
          className="bg-white border border-gray-300 rounded-lg p-3 text-gray-800 text-[16px]"
        />
      </View>

      {/* সর্বমোট খরচ */}
      <View className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 mb-4">
        <Text className="text-emerald-800 font-semibold text-[14px]">সর্বমোট খরচ (৳)</Text>
        <Text className="text-emerald-900 font-bold text-[22px] mt-1">
          ৳ {formatBanglaNumber(grandTotal)}
        </Text>
      </View>

      {/* নোট */}
      <View className="mb-6">
        <Text className="text-gray-600 font-semibold mb-1 text-[15px]">নোট (ঐচ্ছিক)</Text>
        <TextInput
          multiline
          numberOfLines={3}
          placeholder="কিছু লিখুন..."
          placeholderTextColor="#9ca3af"
          value={note}
          onChangeText={(text: string) => setNote(text)}
          className="bg-white border border-gray-300 rounded-lg p-3 text-gray-800 text-[16px] text-start min-h-[80px]"
        />
      </View>

      {/* সাবমিট বাটন */}
      <TouchableOpacity 
        onPress={handleSave}
        className="bg-emerald-700 py-4 rounded-xl items-center justify-center mb-12"
      >
        <Text className="text-white font-bold text-[18px]">Save Entry</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}