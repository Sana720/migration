import Link from 'next/image';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-primary-navy text-white pt-20 pb-10 px-4 md:px-8">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    <div className="space-y-6">
                        <div className="text-2xl font-black tracking-tighter">FORTE MIGRATION</div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Expert migration services tailored to your needs. We help you navigate the complexities of Australian visa processes with confidence.
                        </p>
                        <div className="flex gap-4">
                            <Facebook className="w-5 h-5 text-gray-400 hover:text-accent-green cursor-pointer transition-colors" />
                            <Instagram className="w-5 h-5 text-gray-400 hover:text-accent-green cursor-pointer transition-colors" />
                            <Linkedin className="w-5 h-5 text-gray-400 hover:text-accent-green cursor-pointer transition-colors" />
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-lg">Services</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><button className="hover:text-accent-green transition-colors">Skilled Migration</button></li>
                            <li><button className="hover:text-accent-green transition-colors">Partner Visas</button></li>
                            <li><button className="hover:text-accent-green transition-colors">Student Visas</button></li>
                            <li><button className="hover:text-accent-green transition-colors">Employer Sponsored</button></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-lg">Quick Links</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><button className="hover:text-accent-green transition-colors">Home</button></li>
                            <li><button className="hover:text-accent-green transition-colors">About Us</button></li>
                            <li><button className="hover:text-accent-green transition-colors">Contact</button></li>
                            <li><button className="hover:text-accent-green transition-colors">Privacy Policy</button></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-lg">Contact Us</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-accent-green" />
                                <span>hello@fortemigration.com.au</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-accent-green" />
                                <span>1300 558 472</span>
                            </li>
                            <li className="flex items-center gap-3 text-left">
                                <MapPin className="w-4 h-4 text-accent-green shrink-0" />
                                <span>Sydney, NSW, Australia</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    &copy; {new Date().getFullYear()} Forte Migration. All Rights Reserved. MARA Registered.
                </div>
            </div>
        </footer>
    );
}
