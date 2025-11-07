import React from "react";

type Plan = {
  name: string;
  description: string;
  price: string;
  buttonText: string;
  features: string[];
};

type ComparisonFeature = {
  name: string;
  values: (string | number)[];
};

const plans: Plan[] = [
  {
    name: "Basic",
    description: "Ideal for small institutions or partners sending limited daily opportunities.",
    price: "₦170,000/month",
    buttonText: "Get Started",
    features: [
      "Email sends: 5,000/day (~150,000/month)",
      "Contact limit: 5,000",
      "Users: 1",
      "Basic automation (3 actions)",
      "ABS Standard templates only",
      "Basic reporting dashboard",
      "Email support",
      "Cancel anytime",
    ],
  },
  {
    name: "Growth",
    description: "Perfect for organizations or schools running frequent email outreach campaigns.",
    price: "₦280,000/month",
    buttonText: "Choose Plan",
    features: [
      "Email sends: 10,000/day (~300,000/month)",
      "Contact limit: 10,000",
      "Users: 2",
      "Automation: 10 actions",
      "Standard reports",
      "Chat support",
      "ABS Standard templates only",
      "Verified ABS delivery system",
    ],
  },
  {
    name: "Pro",
    description: "Best for regional or high-volume partners needing more daily delivery capacity.",
    price: "₦450,000/month",
    buttonText: "Upgrade",
    features: [
      "Email sends: 25,000/day (~750,000/month)",
      "Contact limit: 25,000",
      "Users: 3",
      "Automation: 20 actions",
      "Extended reports & insights",
      "Priority support",
      "ABS Standard templates only",
      "Verified ABS delivery system",
    ],
  },
  {
    name: "Enterprise",
    description:
      "Designed for national partners or campaigns that reach students across multiple schools.",
    price: "₦650,000+/month",
    buttonText: "Contact Us",
    features: [
      "Email sends: 50,000+/day (~1.5M+/month)",
      "Contact limit: 50,000+",
      "Users: 5+",
      "Automation: Unlimited",
      "Full summary reporting",
      "Priority support",
      "ABS Standard templates only",
      "Verified ABS delivery system",
    ],
  },
];

const comparisonData: ComparisonFeature[] = [
  { name: "Email Sends (per month)", values: ["150k", "300k", "750k", "1.5M+"] },
  { name: "Contact Limit", values: ["5k", "10k", "25k", "50k+"] },
  { name: "User Accounts", values: [1, 2, 3, "5+"] },
  { name: "Automation Actions", values: [3, 10, 20, "Unlimited"] },
  { name: "Reporting Level", values: ["Basic", "Standard", "Extended", "Full Summary"] },
  { name: "Support Type", values: ["Email", "Chat", "Priority", "Priority"] },
  { name: "Templates", values: ["ABS Only", "ABS Only", "ABS Only", "ABS Only"] },
  { name: "Sending Identity", values: ["ABS Domain", "ABS Domain", "ABS Domain", "ABS Domain"] },
];

const BillingPricing: React.FC = () => {
  return (
    <div className="bg-gray-100 p-8 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">ABS Partner Email Plans</h2>
      <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
        Reach over 8,000 verified students across multiple schools through ABS verified email
        campaigns. Choose a plan that fits your outreach goals and send opportunities directly to
        active learners.
      </p>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition"
          >
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">{plan.name}</h3>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <p className="text-3xl font-bold text-gray-900">{plan.price}</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl mt-4 w-full">
                {plan.buttonText}
              </button>
            </div>
            <div className="p-6 border-t border-gray-200">
              <ul className="text-sm text-gray-600 space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="mt-16 overflow-x-auto">
        <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Key Feature Comparison
        </h3>
        <table className="table-auto w-full border border-gray-200 text-center text-sm">
          <thead className="bg-gray-200 text-gray-800 font-semibold">
            <tr>
              <th className="border p-3">Features</th>
              {plans.map((plan) => (
                <th key={plan.name} className="border p-3">
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {comparisonData.map((row, rowIndex) => (
              <tr key={row.name} className={rowIndex % 2 === 1 ? "bg-gray-50" : ""}>
                <td className="border p-3">{row.name}</td>
                {row.values.map((val, i) => (
                  <td key={i} className="border p-3">
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upgrade Section */}
      <div className="mt-16 text-center">
        <h3 className="text-3xl font-bold text-gray-900 mb-6">Ready to Reach More Students?</h3>
        <p className="text-gray-700 max-w-xl mx-auto mb-8">
          Select a plan and start promoting your opportunities to verified students through ABS
          today.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default BillingPricing;
