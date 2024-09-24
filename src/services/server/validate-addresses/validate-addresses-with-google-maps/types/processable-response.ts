export interface ProcessableResponse {
  result: {
    verdict: {
      hasUnconfirmedComponents?: boolean;
    };
    address: {
      postalAddress: {
        postalCode: string;
        administrativeArea: string;
        locality: string;
        addressLines: string[];
      };
      addressComponents: Array<{
        componentName: {
          text: string;
        };
        componentType: string;
        confirmationLevel: string;
      }>;
      missingComponentTypes?: string[];
    };
  };
}
