import { API_URL } from "../config";

// Lägg till en ny order
export const addOrder = async (order) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  if (!response.ok) {
    throw new Error("Failed to add order");
  }
  return await response.json();
};

// Uppdatera kurser (orderCount)

export const updateCourseOrderCount = async (id, increment) => {
  console.log(`Attempting to fetch course with id: ${id}`);

  const response = await fetch(`${API_URL}/courses/${id}`);
  if (!response.ok) {
    console.error(`Failed to fetch course. Status: ${response.status}`);
    throw new Error("Failed to fetch course");
  }

  const course = await response.json();
  console.log("Fetched course:", course);

  const updatedCourse = {
    ...course,
    orderCount: course.orderCount + increment,
  };

  const updateResponse = await fetch(`${API_URL}/courses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedCourse),
  });

  if (!updateResponse.ok) {
    console.error(`Failed to update course. Status: ${updateResponse.status}`);
    throw new Error("Failed to update course order count");
  }

  return await updateResponse.json();
};

// Uppdatera en användares recent orders
export const updateUserRecentOrders = async (userId, order) => {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recentOrders: order }),
  });
  if (!response.ok) {
    throw new Error("Failed to update user's recent orders");
  }
  return await response.json();
};
// Hämta senaste ordrar för en användare
export const fetchRecentOrders = async () => {
  const response = await fetch(`${API_URL}/orders?limit=3`);
  if (!response.ok) {
    throw new Error("Failed to fetch recent orders");
  }
  return await response.json();
};

export const deleteOrdersByUserId = async (userId) => {
  // Hämta alla ordrar för användaren
  const res = await fetch(`${API_URL}/orders?userId=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch orders");

  const orders = await res.json();

  // Radera ordrar en och en
  for (const order of orders) {
    const delRes = await fetch(`${API_URL}/orders/${order.id}`, {
      method: "DELETE",
    });
    if (!delRes.ok) {
      throw new Error(`Failed to delete order with id ${order.id}`);
    }
  }
};
