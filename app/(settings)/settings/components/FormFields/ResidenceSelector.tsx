import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessagesProps } from '@/i18n';
import { useEffect, useState } from 'react';
import { GetCountries, GetState, GetCity } from 'react-country-state-city';

interface ResidenceSelectorProps {
    d?: MessagesProps;
    form: any;
    residence: {
        country: string;
        province: string;
        city: string;
    };
}
interface Country {
    id: string;
    name: string;
    code: string;
}

interface Province {
    id: string;
    name: string;
    code: string;
}

interface City {
    id: string;
    name: string;
}

async function getCountry(): Promise<Country[]> {
    try {
        const countries = await GetCountries();
        const data = countries.map((country: any) => ({
            id: country.id,
            name: country.name,
            code: country.iso3,
        }));
        return data;
    } catch (error) {
        console.log('error fetching countries:', error);
        return [];
    }
}

async function getProvince(countryId: string): Promise<Province[]> {
    try {
        const provinces = await GetState(countryId);
        const data = provinces.map((province: any) => ({
            id: province.id,
            name: province.name,
            code: province.state_code, // Corrected to state_code
        }));
        return data;
    } catch (error) {
        console.log('error fetching provinces:', error);
        return [];
    }
}

async function getCity(countryId: string, provinceId: string): Promise<City[]> {
    try {
        const cities = await GetCity(countryId, provinceId);
        const data = cities.map((city: any) => ({
            id: city.id,
            name: city.name,
        }));
        return data;
    } catch (error) {
        console.log('error fetching cities:', error);
        return [];
    }
}

const ResidenceSelector = ({ d, form, residence }: ResidenceSelectorProps) => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
    const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null);
    const [selectedCityName, setSelectedCityName] = useState<string | null>(null); // Added state for selected city name

    useEffect(() => {
        async function fetchCountries() {
            const data = await getCountry();
            setCountries(data || []);
        }
        fetchCountries();
    }, []);

    useEffect(() => {
        const fetchProvinces = async (countryId: string) => {
            const data = await getProvince(countryId);
            setProvinces(data || []);
        };

        if (selectedCountryId) {
            fetchProvinces(selectedCountryId);
        } else {
            setProvinces([]);
        }
    }, [selectedCountryId]);

    useEffect(() => {
        const fetchCities = async (countryId: string, provinceId: string) => {
            const data = await getCity(countryId, provinceId);
            setCities(data || []);
        };

        if (selectedCountryId && selectedProvinceId) {
            fetchCities(selectedCountryId, selectedProvinceId);
        } else {
            setCities([]);
        }
    }, [selectedCountryId, selectedProvinceId]);
    useEffect(() => {
        const country = countries.find((country) => country.code === residence.country);
        if (country) {
            setSelectedCountryId(country.id);
        }
    }, [residence.country, countries]);

    useEffect(() => {
        const province = provinces.find((province) => province.code === residence.province);
        if (province) {
            setSelectedProvinceId(province.id);
        }
    }, [residence.province, provinces]);

    useEffect(() => {
        setSelectedCityName(residence.city);
    }, [residence.city]);

    const selectedCountryName = countries.find((country) => country.id === selectedCountryId)?.name;
    const selectedProvinceName = provinces.find((province) => province.id === selectedProvinceId)?.name;

    return (
        <div>
            <FormField
                control={form.control}
                name="residence.country"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{d?.user.residence_country}</FormLabel>
                        <Select
                            onValueChange={(value) => {
                                const selectedCountry = countries.find((country) => country.name === value);
                                if (selectedCountry) {
                                    field.onChange(selectedCountry.code); // Store name instead of code
                                    setSelectedCountryId(selectedCountry.id);
                                    setSelectedProvinceId(null);
                                    setCities([]); // Reset cities when country changes
                                }
                            }}
                            value={selectedCountryName ?? ''}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder={d?.user.residence_country} />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {countries.map((country) => (
                                    <SelectItem key={country.id} value={country.name}>
                                        {country.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage className="text-white" />
                    </FormItem>
                )}
            />

            {selectedCountryId && (
                <FormField
                    control={form.control}
                    name="residence.province"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{d?.user.residence_province}</FormLabel>
                            <Select
                                onValueChange={(value) => {
                                    const selectedProvince = provinces.find((province) => province.name === value);
                                    if (selectedProvince) {
                                        field.onChange(selectedProvince.code); // Store name instead of code
                                        setSelectedProvinceId(selectedProvince.id);
                                        setCities([]); // Reset cities when province changes
                                    }
                                }}
                                value={selectedProvinceName ?? ''}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder={d?.user.residence_province} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {provinces.map((province) => (
                                        <SelectItem key={province.id} value={province.name}>
                                            {province.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage className="text-white" />
                        </FormItem>
                    )}
                />
            )}

            {selectedCountryId && selectedProvinceId && (
                <FormField
                    control={form.control}
                    name="residence.city"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{d?.user.residence_city}</FormLabel>
                            <Select
                                onValueChange={(value) => {
                                    const selectedCity = cities.find((city) => city.name === value);
                                    if (selectedCity) {
                                        field.onChange(selectedCity.name); // Store name instead of id
                                        setSelectedCityName(selectedCity.name); // Update state for selected city name
                                    }
                                }}
                                value={selectedCityName ?? ''}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder={d?.user.residence_city} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {cities.map((city) => (
                                        <SelectItem key={city.id} value={city.name}>
                                            {city.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage className="text-white" />
                        </FormItem>
                    )}
                />
            )}
        </div>
    );
};

export default ResidenceSelector;
