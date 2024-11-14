export const generateUUID = () => {
  return ([1e7] as any + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: any) =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
};

export const checkSharedSession = async (apiUrl: string): Promise<boolean> => {
  try {
    const response = await fetch(apiUrl + "use_shared_session", {
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      }
    });
    return response.status === 200;
  } catch (error) {
    console.error('Failed to check shared session:', error);
    return false;
  }
};