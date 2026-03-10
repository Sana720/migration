import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="relative bg-primary-navy text-white pt-20 pb-10 px-4 md:px-8 overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0 opacity-30">
                <Image
                    src="/aboriginal-bg.png"
                    alt="Background Pattern"
                    fill
                    className="object-cover"
                />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-primary-navy/90 via-primary-navy/70 to-primary-navy/90 z-0"></div>

            <div className="container mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    <div className="space-y-6">
                        <div className="relative w-64 h-16 mb-6">
                            <Image
                                src="/logo.png"
                                alt="Forte Migration Logo"
                                fill
                                className="object-contain object-left brightness-0 invert"
                            />
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            Expert migration services tailored to your needs. We help you navigate the complexities of Australian visa processes with confidence.
                        </p>
                        <div className="flex gap-4">
                            <Facebook className="w-5 h-5 text-gray-400 hover:text-accent-green cursor-pointer transition-colors" />
                            <Instagram className="w-5 h-5 text-gray-400 hover:text-accent-green cursor-pointer transition-colors" />
                            <Linkedin className="w-5 h-5 text-gray-400 hover:text-accent-green cursor-pointer transition-colors" />
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <h4 className="font-bold mb-6 text-lg uppercase tracking-wider">Services</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><button className="hover:text-accent-green transition-colors">Skilled Migration</button></li>
                            <li><button className="hover:text-accent-green transition-colors">Partner Visa</button></li>
                            <li><button className="hover:text-accent-green transition-colors">Employer Sponsored</button></li>
                            <li><button className="hover:text-accent-green transition-colors">Student & Graduate Visa</button></li>
                            <li><button className="hover:text-accent-green transition-colors">Parent & Child</button></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-1">
                        <h4 className="md:block hidden font-bold mb-6 text-lg opacity-0 pointer-events-none">More Services</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><button className="hover:text-accent-green transition-colors">Visitor & Holiday</button></li>
                            <li><button className="hover:text-accent-green transition-colors">PR Return & Citizenship</button></li>
                            <li><button className="hover:text-accent-green transition-colors">Urgent Lodgment</button></li>
                            <li><button className="hover:text-accent-green transition-colors">RFI Support</button></li>
                            <li><button className="hover:text-accent-green transition-colors">Refusal & Cancellation</button></li>
                            <li><button className="hover:text-accent-green transition-colors">Ministerial Intervention</button></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-1">
                        <h4 className="font-bold mb-6 text-lg uppercase tracking-wider">Consult</h4>
                        <ul className="space-y-6 text-sm text-gray-400">
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-accent-green" />
                                <span className="font-medium">support@fortemigration.com.au</span>
                            </li>
                            <li className="flex items-start gap-3 text-left">
                                <MapPin className="w-5 h-5 text-accent-green shrink-0" />
                                <span className="font-medium">Melbourne, VIC, Australia</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    &copy; {new Date().getFullYear()} Forte Migration. All Rights Reserved. MARN: 2619201
                </div>
            </div>
        </footer>
    );
}
