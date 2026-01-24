import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';

export const PrivacyPolicyPage = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-[#2c3e5e] selection:bg-[#2c3e5e]/10">
            <SEO
                title="Privacy Policy | Deeplugg Official - Your Data Security & Privacy"
                description="Comprehensive Privacy Policy for Deeplugg users. Information on Cookies, Google AdSense, GDPR, and CCPA compliance for our digital growth ecosystem."
            />
            <Navbar />

            {/* Header Section */}
            <section className="relative pt-32 pb-16 bg-gray-50 border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-black text-[#2c3e5e] mb-6 tracking-tight uppercase">
                        Privacy Policy
                    </h1>
                    <p className="text-gray-500 font-medium">Last Updated: January 24, 2026</p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-slate">
                    <div className="space-y-12">

                        <section>
                            <h2 className="text-2xl font-black text-[#2c3e5e] mb-6">Introduction</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                At <strong>Deeplugg Official</strong>, accessible from https://www.deeplugg.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Deeplugg and how we use it.
                            </p>
                            <p className="text-gray-600 leading-relaxed text-lg mt-4">
                                If you have additional questions or require more information about our Privacy Policy, do not hesitate to <a href="mailto:hello@deeplugg.com" className="text-[#2c3e5e] font-bold underline">contact us</a>.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-[#2c3e5e] mb-6">Log Files</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                Deeplugg follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-[#2c3e5e] mb-6">Cookies and Web Beacons</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                Like any other website, Deeplugg uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-[#2c3e5e] mb-6">Google DoubleClick DART Cookie</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" className="text-[#2c3e5e] font-bold underline">https://policies.google.com/technologies/ads</a>
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-[#2c3e5e] mb-6">Our Advertising Partners</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                Some of advertisers on our site may use cookies and web beacons. Our advertising partners include:
                            </p>
                            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-600 text-lg">
                                <li>Google AdSense</li>
                                <li>Digital Plug Discovery Network</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-[#2c3e5e] mb-6">GDPR Data Protection Rights</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
                            </p>
                            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-600 text-lg">
                                <li><strong>The right to access</strong> – You have the right to request copies of your personal data.</li>
                                <li><strong>The right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate.</li>
                                <li><strong>The right to erasure</strong> – You have the right to request that we erase your personal data, under certain conditions.</li>
                                <li><strong>The right to restrict processing</strong> – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-[#2c3e5e] mb-6">CCPA Privacy Rights (Do Not Sell My Personal Information)</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                Under the CCPA, among other rights, California consumers have the right to:
                            </p>
                            <p className="text-gray-600 leading-relaxed text-lg mt-4">
                                Request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers. Request that a business delete any personal data about the consumer that a business has collected.
                            </p>
                            <p className="text-gray-600 leading-relaxed text-lg mt-4">
                                If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please <a href="mailto:hello@deeplugg.com" className="text-[#2c3e5e] font-bold underline">contact us</a>.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-[#2c3e5e] mb-6">Internal Linking Strategy</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                To maximize your user experience, we recommend checking our <Link to="/about" className="text-[#2c3e5e] font-bold border-b-2 border-[#2c3e5e]/20 hover:border-[#2c3e5e]">About Us</Link> page to understand our mission as a <strong>lifestyle platform</strong>. If you are looking for how to <strong>plug your brand online</strong> securely, please visit our <Link to="/signup" className="text-[#2c3e5e] font-bold border-b-2 border-[#2c3e5e]/20 hover:border-[#2c3e5e]">Get Started</Link> page.
                            </p>
                        </section>

                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};
