import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR TERMS & SERVICES — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple Terms & Services for my website. Here is some context:
// - Website: https://shipfa.st
// - Name: ShipFast
// - Contact information: marc@shipfa.st
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - Ownership: when buying a package, users can download code to create apps. They own the code but they do not have the right to resell it. They can ask for a full refund within 7 day after the purchase.
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Link to privacy-policy: https://shipfa.st/privacy-policy
// - Governing Law: France
// - Updates to the Terms: users will be updated by email

// Please write a simple Terms & Services for my site. Add the current date. Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Terms and Conditions | ${config.appName}`,
  canonicalUrlRelative: "/tos",
});

const TOS = () => {
  return (
    <main className="max-w-xl mx-auto">
      <div className="p-5">
        <Link href="/" className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Terms and Conditions for {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Last Updated: May 05, 2024

Privacy Policy for Birdie App

1. Introduction

Welcome to Birdie App! We are committed to protecting your privacy and ensuring that your personal information is collected and used in a responsible and transparent manner. This Privacy Policy provides detailed information on how your data is collected, used, and protected by Birdie App.

2. Information We Collect

a. Personal Data: We collect personal data that you voluntarily provide to us, which includes your name, email address, and payment information. This information is collected to enable your use of our services, such as subscription to personalized meal plans and nutrition advice.

b. Non-Personal Data: We use cookies to enhance your experience on our website by understanding how you use it. These cookies do not gather personal information about you and are used solely for analytics and performance improvements.

3. Purpose of Data Collection

The data we collect serves the purpose of providing subscription services and our newsletter. It enables us to tailor and optimize our services to meet your specific needs in nutrition advice and meal planning.

4. Data Sharing

We value your privacy. Birdie App does not share your personal or non-personal data with any third parties. Your information is used exclusively for the purposes stated within this Privacy Policy.

5. Children's Privacy

Birdie App does not knowingly collect any personal information from children. If you are under the age of 18, please do not submit any personal information through our website.

6. Updates to This Privacy Policy

We may update this Privacy Policy periodically to reflect changes to our information practices. If we make any substantial changes, we will notify you via email and post the updated policy on this page.

7. Contact Us

If you have any questions about this Privacy Policy, please contact us at support@birdieapp.co.

For all other inquiries, please visit our Contact Us page on the Website.

By using Birdieapp, you consent to the terms of this Privacy Policy.`}
        </pre>
      </div>
    </main>
  );
};

export default TOS;
