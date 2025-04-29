import React from "react";

export default function AboutUs() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-green-700">About Us</h1>
      <p className="mb-4 text-lg text-gray-800">
        Welcome to our Cleaning Management System! We are dedicated to providing top-notch cleaning services tailored to your needs. Our experienced team ensures every space is spotless, hygienic, and inviting.
      </p>
      <p className="mb-2 text-gray-700">
        <strong>Our Mission:</strong> To deliver reliable, affordable, and high-quality cleaning solutions for homes and businesses.
      </p>
      <p className="mb-2 text-gray-700">
        <strong>Why Choose Us?</strong>
        <ul className="list-disc pl-6 mt-2">
          <li>Professional and trained staff</li>
          <li>Eco-friendly cleaning products</li>
          <li>Flexible scheduling and competitive pricing</li>
          <li>Customer satisfaction guaranteed</li>
        </ul>
      </p>
      <p className="mt-4 text-gray-600">Contact us today to experience the difference!</p>
    </div>
  );
}
