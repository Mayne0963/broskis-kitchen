// Email templates with improved styling for different order statuses

// Common header and footer for all emails
const emailHeader = (title: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 2px solid #f0f0f0;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #000000;
    }
    .content {
      padding: 20px 0;
    }
    .footer {
      text-align: center;
      padding: 20px 0;
      font-size: 12px;
      color: #777777;
      border-top: 2px solid #f0f0f0;
    }
    h1 {
      color: #000000;
      margin-top: 0;
    }
    h2 {
      color: #333333;
      margin-top: 20px;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #3b82f6;
      color: #ffffff;
      text-decoration: none;
      border-radius: 4px;
      margin-top: 20px;
    }
    .order-details {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 4px;
      margin: 20px 0;
    }
    .status-badge {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: bold;
    }
    .status-confirmed {
      background-color: #e0f2fe;
      color: #0369a1;
    }
    .status-processing {
      background-color: #fef3c7;
      color: #92400e;
    }
    .status-completed {
      background-color: #dcfce7;
      color: #166534;
    }
    .status-cancelled {
      background-color: #fee2e2;
      color: #b91c1c;
    }
    .divider {
      height: 1px;
      background-color: #e5e7eb;
      margin: 15px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Broski's Kitchen</div>
    </div>
    <div class="content">
`

const emailFooter = `
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Broski's Kitchen. All rights reserved.</p>
      <p>123 Main Street, New York, NY 10001</p>
      <p>
        <a href="https://broskiskitchen.com/terms">Terms of Service</a> | 
        <a href="https://broskiskitchen.com/privacy">Privacy Policy</a>
      </p>
    </div>
  </div>
</body>
</html>
`

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return `$${(amount / 100).toFixed(2)}`
}

// Helper function to format date
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Helper function to render order items if available
const renderOrderItems = (order: any): string => {
  if (!order.items || order.items.length === 0) {
    return ""
  }

  let itemsHtml = `
    <h2>Order Items</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background-color: #f3f4f6;">
          <th style="text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb;">Item</th>
          <th style="text-align: center; padding: 8px; border-bottom: 1px solid #e5e7eb;">Quantity</th>
          <th style="text-align: right; padding: 8px; border-bottom: 1px solid #e5e7eb;">Price</th>
        </tr>
      </thead>
      <tbody>
  `

  order.items.forEach((item: any) => {
    itemsHtml += `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
        <td style="text-align: center; padding: 8px; border-bottom: 1px solid #e5e7eb;">${item.quantity}</td>
        <td style="text-align: right; padding: 8px; border-bottom: 1px solid #e5e7eb;">${formatCurrency(item.price)}</td>
      </tr>
    `
  })

  itemsHtml += `
      </tbody>
    </table>
  `

  return itemsHtml
}

// Helper function to render delivery information
const renderDeliveryInfo = (order: any): string => {
  if (!order.deliveryInfo) {
    return ""
  }

  const method = order.deliveryInfo.method
  let deliveryHtml = `
    <div class="order-details">
      <h2>${method === "delivery" ? "Delivery" : "Pickup"} Information</h2>
  `

  if (method === "delivery" && order.deliveryInfo.address) {
    deliveryHtml += `
      <p><strong>Address:</strong><br>
      ${order.deliveryInfo.address.street}${order.deliveryInfo.address.apt ? `, ${order.deliveryInfo.address.apt}` : ""}<br>
      ${order.deliveryInfo.address.city}, ${order.deliveryInfo.address.state} ${order.deliveryInfo.address.zipCode}</p>
    `

    if (order.deliveryInfo.address.instructions) {
      deliveryHtml += `<p><strong>Instructions:</strong> ${order.deliveryInfo.address.instructions}</p>`
    }
  } else if (method === "pickup" && order.deliveryInfo.pickupLocation) {
    deliveryHtml += `
      <p><strong>Pickup Location:</strong> ${order.deliveryInfo.pickupLocation}</p>
    `
  }

  deliveryHtml += `
      <p><strong>Contact Phone:</strong> ${order.deliveryInfo.contactPhone}</p>
  `

  if (!order.isScheduled && order.deliveryInfo.estimatedTime) {
    deliveryHtml += `
      <p><strong>Estimated ${method === "delivery" ? "Delivery" : "Pickup"} Time:</strong> ${order.deliveryInfo.estimatedTime}</p>
    `
  }

  deliveryHtml += `</div>`
  return deliveryHtml
}

// Helper function to render scheduled information
const renderScheduledInfo = (order: any): string => {
  if (!order.isScheduled || !order.scheduledInfo) {
    return ""
  }

  return `
    <div class="order-details">
      <h2>Scheduled Information</h2>
      <p><strong>Date:</strong> ${formatDate(order.scheduledInfo.date)}</p>
      <p><strong>Time Slot:</strong> ${order.scheduledInfo.timeSlot}</p>
      ${order.specialEvent ? `<p><strong>Special Event:</strong> ${order.specialEvent}</p>` : ""}
    </div>
  `
}

// Email templates for different order statuses
export const emailTemplates = {
  confirmed: {
    subject: "Your Order Has Been Confirmed - Broski's Kitchen",
    body: (order: any) => `
      ${emailHeader("Order Confirmed")}
      <h1>Thank you for your order!</h1>
      <p>Your order #${order.id.substring(0, 8)} has been confirmed and is being prepared.</p>
      
      <div class="order-details">
        <h2>Order Details</h2>
        <p><strong>Order ID:</strong> ${order.id.substring(0, 8)}...</p>
        <p><strong>Date:</strong> ${formatDate(order.createdAt)}</p>
        <p><strong>Total:</strong> ${formatCurrency(order.amount)}</p>
        <p><strong>Status:</strong> <span class="status-badge status-confirmed">Confirmed</span></p>
      </div>
      
      ${renderScheduledInfo(order)}
      ${renderDeliveryInfo(order)}
      ${renderOrderItems(order)}
      
      <div class="divider"></div>
      
      <p>You can view your order details and status anytime by visiting your account dashboard.</p>
      <a href="https://broskiskitchen.com/orders/${order.id}" class="button">View Order</a>
      
      <p>Thank you for choosing Broski's Kitchen!</p>
      ${emailFooter}
    `,
  },
  processing: {
    subject: "Your Order is Being Prepared - Broski's Kitchen",
    body: (order: any) => `
      ${emailHeader("Order Processing")}
      <h1>Your order is being prepared!</h1>
      <p>Your order #${order.id.substring(0, 8)} is now being prepared by our kitchen team.</p>
      
      <div class="order-details">
        <h2>Order Details</h2>
        <p><strong>Order ID:</strong> ${order.id.substring(0, 8)}...</p>
        <p><strong>Date:</strong> ${formatDate(order.createdAt)}</p>
        <p><strong>Total:</strong> ${formatCurrency(order.amount)}</p>
        <p><strong>Status:</strong> <span class="status-badge status-processing">Processing</span></p>
      </div>
      
      ${renderScheduledInfo(order)}
      ${renderDeliveryInfo(order)}
      ${renderOrderItems(order)}
      
      <div class="divider"></div>
      
      <p>You can view your order details and status anytime by visiting your account dashboard.</p>
      <a href="https://broskiskitchen.com/orders/${order.id}" class="button">View Order</a>
      
      <p>Thank you for choosing Broski's Kitchen!</p>
      ${emailFooter}
    `,
  },
  completed: {
    subject: "Your Order is Ready - Broski's Kitchen",
    body: (order: any) => `
      ${emailHeader("Order Ready")}
      <h1>Your order is ready!</h1>
      <p>Your order #${order.id.substring(0, 8)} is now ${
        order.deliveryInfo && order.deliveryInfo.method === "delivery" ? "out for delivery" : "ready for pickup"
      }.</p>
      
      <div class="order-details">
        <h2>Order Details</h2>
        <p><strong>Order ID:</strong> ${order.id.substring(0, 8)}...</p>
        <p><strong>Date:</strong> ${formatDate(order.createdAt)}</p>
        <p><strong>Total:</strong> ${formatCurrency(order.amount)}</p>
        <p><strong>Status:</strong> <span class="status-badge status-completed">Ready</span></p>
      </div>
      
      ${renderScheduledInfo(order)}
      ${renderDeliveryInfo(order)}
      
      ${
        order.deliveryInfo && order.deliveryInfo.method === "pickup"
          ? `<p><strong>Please bring your order confirmation when you arrive for pickup.</strong></p>`
          : ""
      }
      
      <div class="divider"></div>
      
      <p>You can view your order details and status anytime by visiting your account dashboard.</p>
      <a href="https://broskiskitchen.com/orders/${order.id}" class="button">View Order</a>
      
      <p>Thank you for choosing Broski's Kitchen!</p>
      ${emailFooter}
    `,
  },
  cancelled: {
    subject: "Your Order Has Been Cancelled - Broski's Kitchen",
    body: (order: any) => `
      ${emailHeader("Order Cancelled")}
      <h1>Your order has been cancelled</h1>
      <p>Your order #${order.id.substring(0, 8)} has been cancelled.</p>
      
      <div class="order-details">
        <h2>Order Details</h2>
        <p><strong>Order ID:</strong> ${order.id.substring(0, 8)}...</p>
        <p><strong>Date:</strong> ${formatDate(order.createdAt)}</p>
        <p><strong>Total:</strong> ${formatCurrency(order.amount)}</p>
        <p><strong>Status:</strong> <span class="status-badge status-cancelled">Cancelled</span></p>
      </div>
      
      ${renderOrderItems(order)}
      
      <div class="divider"></div>
      
      <p>If you did not request this cancellation or have any questions, please contact our customer support.</p>
      <a href="mailto:support@broskiskitchen.com" class="button">Contact Support</a>
      
      <p>Thank you for choosing Broski's Kitchen!</p>
      ${emailFooter}
    `,
  },
}
