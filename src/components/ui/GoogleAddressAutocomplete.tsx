import { useEffect, useRef, useState } from 'react';
import { FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { logger } from '@/utils/logger';

interface GoogleAddressAutocompleteProps {
  value?: string;
  onChange?: (value: string) => void;
  onAddressSelect: (addressData: {
    formattedAddress: string;
    street: string;
    suburb: string;
    state: string;
    country: string;
    zipCode: string;
  }) => void;
  className?: string;
}

declare global {
  interface Window {
    google: any;
    initGoogleAutocomplete: () => void;
  }
}

export default function GoogleAddressAutocomplete({
  value,
  onChange,
  onAddressSelect,
  className,
}: GoogleAddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(value);
  const autocompleteRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
  };

  const initAutocomplete = () => {
    if (!inputRef.current || !window.google?.maps?.places) {
      logger.warn('Google Maps API not loaded yet');
      return;
    }

    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ['address'],
          componentRestrictions: { country: 'au' },
          fields: ['address_components', 'formatted_address'],
        }
      );

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        if (!place.address_components) {
          logger.warn('No address components found in selected place');
          return;
        }

        const addressData = {
          formattedAddress: place.formatted_address || '',
          street: '',
          suburb: '',
          state: '',
          country: '',
          zipCode: '',
        };

        place.address_components.forEach((component: any) => {
          const types = component.types;
          if (types.includes('street_number') || types.includes('route')) {
            addressData.street = addressData.street
              ? `${addressData.street} ${component.long_name}`
              : component.long_name;
          }
          if (types.includes('locality')) {
            addressData.suburb = component.long_name;
          }
          if (types.includes('administrative_area_level_1')) {
            addressData.state = component.short_name;
          }
          if (types.includes('country')) {
            addressData.country = component.long_name;
          }
          if (types.includes('postal_code')) {
            addressData.zipCode = component.long_name;
          }
        });

        logger.info('Address selected:', addressData);
        setInputValue(place.formatted_address || '');
        onChange?.(place.formatted_address || '');
        onAddressSelect(addressData);
      });

      setIsLoading(false);
      logger.info('Google Places Autocomplete initialized successfully');
    } catch (error) {
      logger.error('Error initializing Google Places Autocomplete:', error);
      setIsLoading(true);
    }
  };

  useEffect(() => {
    const handleGoogleMapsLoaded = () => {
      logger.info('Google Maps loaded event received');
      initAutocomplete();
    };

    if (window.google?.maps?.places) {
      logger.info('Google Maps already loaded, initializing directly');
      initAutocomplete();
    } else {
      window.addEventListener('google-maps-loaded', handleGoogleMapsLoaded);
      logger.info('Waiting for Google Maps to load...');
    }

    return () => {
      window.removeEventListener('google-maps-loaded', handleGoogleMapsLoaded);
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  return (
    <FormControl>
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        placeholder={isLoading ? "Loading address lookup..." : "Start typing your address..."}
        className={className}
        autoComplete="off"
        disabled={isLoading}
      />
    </FormControl>
  );
}
