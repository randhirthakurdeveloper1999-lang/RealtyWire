//authApi.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://realtywire.in';

export const googleLoginApi = async (idToken: string) => {
  const response = await fetch(`${BASE_URL}/api/google-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_token: idToken }),
  });

  return response.json();
};

export const logoutApi = async () => {
  const token = await AsyncStorage.getItem('token');

  if (!token) return;

  return fetch(`${BASE_URL}/api/logout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
};

export const updateProfileApi = async (data: any) => {
  const token = await AsyncStorage.getItem('token');

  console.log('Token:', token);
  console.log('Sending profile data:', data);

  const response = await fetch(
    'https://realtywire.in/api/onboarding/update-profile',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );

  const json = await response.json();

  console.log('API raw response:', json);

  return json;
};

export const updateDocumentApi = async (payload: any) => {
  const token = await AsyncStorage.getItem('token');

  console.log('Uploading document payload:', payload);

  const formData = new FormData();

  if (payload.gst) {
    formData.append('gst_number', payload.gst);
  }

  if (payload.rera) {
    formData.append('rera_number', payload.rera);
  }

  if (payload.visitingFile) {
    formData.append('visiting_card', {
      uri: payload.visitingFile.uri,
      type: payload.visitingFile.type,
      name: payload.visitingFile.fileName || 'visiting.jpg',
    } as any);
  }

  const response = await fetch(
    'https://realtywire.in/api/onboarding/update-document',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      body: formData,
    },
  );

  const json = await response.json();

  console.log('Document API response:', json);

  return json;
};

/*===============Home Property APIS==================*/
export const toggleFavouriteApi = async (propertyId: number) => {
  const token = await AsyncStorage.getItem('token');

  const res = await fetch(`${BASE_URL}/api/dealer/toggle-favourite`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ property_id: propertyId }),
  });

  return res.json();
};

export const favouriteListApi = async () => {
  const token = await AsyncStorage.getItem('token');

  const res = await fetch(`${BASE_URL}/api/dealer/favourite-list`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  return res.json();
};

export const addFavouriteApi = async (propertyId: number) => {
  const token = await AsyncStorage.getItem('token');

  const res = await fetch(`${BASE_URL}/api/dealer/add-favourite`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ property_id: propertyId }),
  });

  return res.json();
};

export const removeFavouriteApi = async (propertyId: number) => {
  const token = await AsyncStorage.getItem('token');

  const res = await fetch(`${BASE_URL}/api/dealer/remove-favourite`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ property_id: propertyId }),
  });

  return res.json();
};

/* ================= PROPERTY APIs ================= */

export const homePropertyListApi = async (
  page = 1,
  limit = 10,
  filters: any = {},
) => {
  const token = await AsyncStorage.getItem('token');

  const res = await fetch(`${BASE_URL}/api/property-listing`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      page,
      limit,
      ...filters,
    }),
  });

  return res.json();
};

export const propertyListApi = async (page = 1, limit = 5) => {
  const token = await AsyncStorage.getItem('token');

  const res = await fetch(
    `${BASE_URL}/api/dealer/property-list?page=${page}&limit=${limit}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
  );
  return res.json();
};

export const addPropertyApi = async (payload: any) => {
  const token = await AsyncStorage.getItem('token');

  const res = await fetch(`${BASE_URL}/api/dealer/property-add`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return res.json();
};

export const propertyDetailsApi = async (id: number) => {
  const token = await AsyncStorage.getItem('token');

  const res = await fetch(`${BASE_URL}/api/dealer/property-details`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });

  return res.json();
};

export const deletePropertyApi = async (id: number) => {
  const token = await AsyncStorage.getItem('token');

  const res = await fetch(`${BASE_URL}/api/dealer/property-delete`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });

  return res.json();
};

export const propertyEditApi = async (id: number) => {
  const token = await AsyncStorage.getItem('token');

  const res = await fetch(`${BASE_URL}/api/dealer/property-edit`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });

  return res.json();
};

export const deletePropertyImageApi = async (imageId: number) => {
  const token = await AsyncStorage.getItem('token');

  const res = await fetch(`${BASE_URL}/api/dealer/property-delete-image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image_id: imageId,
    }),
  });

  return res.json();
};

export const categoryListApi = async () => {
  const token = await AsyncStorage.getItem('token');

  const res = await fetch(`${BASE_URL}/api/dealer/category-list`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  return res.json();
};

export const cityListApi = async () => {
  const token = await AsyncStorage.getItem('token');

  const res = await fetch(`${BASE_URL}/api/dealer/city-list`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  return res.json();
};

// Recent API

export const historyListApi = async (limit = 10) => {
  const token = await AsyncStorage.getItem('token');

  const res = await fetch(`${BASE_URL}/api/dealer/history-list`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      limit,
    }),
  });

  return res.json();
};

export const removeHistoryApi = async (propertyId: number) => {
  const token = await AsyncStorage.getItem('token');

  const res = await fetch(`${BASE_URL}/api/dealer/remove-history`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      property_id: propertyId,
    }),
  });

  return res.json();
};

export const addHistoryApi = async (propertyId: number) => {
  const token = await AsyncStorage.getItem('token');

  const res = await fetch(`${BASE_URL}/api/dealer/add-history`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      property_id: propertyId,
    }),
  });

  return res.json();
};

export const getPlansApi = async () => {
  const token = await AsyncStorage.getItem('token');

  console.log('🔑 Token:', token);

  const res = await fetch(`https://realtywire.in/api/dealer-subscription`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  const json = await res.json();

  console.log('📥 Full API Response:', json);

  // ✅ safe return
  return json?.data?.plans || [];
};

export const subscriptionRequestApi = async (data: any) => {
  const token = await AsyncStorage.getItem('token');

  console.log('🔑 Token:', token);
  console.log('📤 Request Body:', data);

  const res = await fetch(
    `https://realtywire.in/api/dealer-subscription-request`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );

  const json = await res.json();

  console.log('📥 Response JSON:', json);

  return json;
};


export const subscriptionHistoryApi = async () => {
  const token = await AsyncStorage.getItem('token');

  console.log('🔑 Token:', token);

  const res = await fetch(
    `https://realtywire.in/api/dealer-subscription-history`,
    {
      method: 'POST', // 👈 important
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
  );

  const json = await res.json();

  console.log('📥 History API:', json);

  return json?.data || [];
};


export const deleteAccountApi = async () => {
  const token = await AsyncStorage.getItem('token');

  const res = await fetch(`${BASE_URL}/api/delete-account`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  return res.json();
};