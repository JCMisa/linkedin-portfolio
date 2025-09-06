"use client";

import { useState } from "react";
import { toast } from "sonner";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in every field.");
      return;
    }

    const subject = `Message from ${name} (${email})`;
    const body = encodeURIComponent(message);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=johncarlomisa399@gmail.com&su=${encodeURIComponent(
      subject
    )}&body=${body}`;

    window.open(gmailUrl, "_blank");
  };

  return (
    <section className="text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 body-font relative mt-13">
      <div className="absolute inset-0 bg-gray-100 dark:bg-gray-900">
        <iframe
          title="map"
          width="100%"
          height="100%"
          src="https://maps.google.com/maps?q=San%20Pablo%20City%20Laguna,%20Philippines&t=&z=13&ie=UTF8&iwloc=&output=embed"
          style={{ filter: "grayscale(1) contrast(1.2) opacity(0.16)" }}
        />
      </div>

      <div className="container px-5 py-24 mx-auto flex">
        <div className="lg:w-1/3 md:w-1/2 bg-gray-100 dark:bg-gray-900 shadow-md rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10">
          <h2 className="text-black dark:text-white text-lg mb-1 font-medium title-font">
            Get in Touch!
          </h2>
          <p className="leading-relaxed mb-5">
            I&apos;m always open to new projects, collaborations, and
            conversations. Feel free to reach out to me!
          </p>

          <div className="relative mb-4">
            <label htmlFor="name" className="leading-7 text-sm">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-200 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary text-base outline-none text-gray-900 dark:text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>

          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-200 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary text-base outline-none text-gray-900 dark:text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>

          <div className="relative mb-4">
            <label htmlFor="message" className="leading-7 text-sm">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-gray-200 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary h-32 text-base outline-none text-gray-900 dark:text-gray-100 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
            />
          </div>

          <button
            onClick={handleSend}
            className="text-white bg-primary border-0 py-2 px-6 focus:outline-none hover:bg-primary-600 rounded text-lg cursor-pointer"
          >
            Send Message
          </button>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-opacity-90 mt-3">
            I&apos;ll do my best to respond as soon as possible.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
