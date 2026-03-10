export const loginApi = async () => {
  const response = await fetch("https://fakestoreapi.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "mor_2314",
      password: "83r5^_",
    }),
  });

  return response.json();
};