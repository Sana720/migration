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
                <div className="grid grid-cols-[1.2fr_1fr] lg:grid-cols-4 gap-8 md:gap-12 mb-20">
                    {/* Left Column (Mobile): Logo + Consult */}
                    <div className="col-span-1 flex flex-col gap-16 lg:contents">
                        <div className="space-y-6 lg:order-1">
                            <div className="relative w-56 h-14 lg:w-80 lg:h-20 mb-4">
                                <Image
                                    src="/logo.png"
                                    alt="Forte Migration Logo"
                                    fill
                                    className="object-contain object-left"
                                    style={{
                                        filter: `
                                            drop-shadow(0 0 1px white) 
                                            drop-shadow(0 0 1px white) 
                                            drop-shadow(0 0 1px white) 
                                            drop-shadow(0 0 2px white) 
                                            drop-shadow(0 0 5px rgba(255,255,255,0.3))
                                        `
                                    }}
                                />
                            </div>

                            <p className="text-gray-400 text-[14px] leading-relaxed max-w-md">
                                Expert immigration guidance built on honesty and transparent results. We don't just process visas; we build futures.
                            </p>
                            <div className="flex gap-4">
                                <Facebook className="w-5 h-5 text-gray-400 hover:text-accent-green cursor-pointer transition-colors" />
                                <Instagram className="w-5 h-5 text-gray-400 hover:text-accent-green cursor-pointer transition-colors" />
                                <Linkedin className="w-5 h-5 text-gray-400 hover:text-accent-green cursor-pointer transition-colors" />
                            </div>
                        </div>

                        <div className="lg:order-4 pt-4 md:pt-0 ml-2">
                            <h4 className="font-bold mb-6 text-lg uppercase tracking-wider text-white">Consult</h4>
                            <ul className="space-y-6 text-sm text-gray-400">
                                <li className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-accent-green shrink-0" />
                                    <span className="font-medium break-all text-[12px] sm:text-sm">support@fortemigration.com.au</span>
                                </li>
                                <li className="flex items-start gap-3 text-left">
                                    <MapPin className="w-5 h-5 text-accent-green shrink-0" />
                                    <span className="font-medium text-[12px] sm:text-sm">Melbourne, VIC, Australia</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Column (Mobile): Services + More */}
                    <div className="col-span-1 flex flex-col lg:contents">
                        <div className="lg:order-2">
                            <h4 className="font-bold mb-6 text-lg uppercase tracking-wider h-10 lg:h-auto flex items-center">Services</h4>
                            <ul className="space-y-4 text-sm text-gray-400">
                                <li><button className="hover:text-accent-green transition-colors">Skilled Migration</button></li>
                                <li><button className="hover:text-accent-green transition-colors">Partner Visa</button></li>
                                <li><button className="hover:text-accent-green transition-colors">Employer Sponsored</button></li>
                                <li><button className="hover:text-accent-green transition-colors">Student & Graduate Visa</button></li>
                                <li><button className="hover:text-accent-green transition-colors">Parent & Child</button></li>
                            </ul>
                        </div>

                        <div className="lg:order-3 lg:pt-0">
                            {/* Heading hidden on mobile to keep the list continuous */}
                            <h4 className="font-bold mb-6 text-lg uppercase tracking-wider md:opacity-0 md:pointer-events-none md:block hidden">More</h4>
                            <ul className="space-y-4 text-sm text-gray-400">
                                <li><button className="hover:text-accent-green transition-colors">Visitor & Holiday</button></li>
                                <li><button className="hover:text-accent-green transition-colors">PR Return & Citizenship</button></li>
                                <li><button className="hover:text-accent-green transition-colors">Urgent Lodgment</button></li>
                                <li><button className="hover:text-accent-green transition-colors">RFI Support</button></li>
                                <li><button className="hover:text-accent-green transition-colors">Refusal & Cancellation</button></li>
                                <li><button className="hover:text-accent-green transition-colors">Ministerial Intervention</button></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    &copy; {new Date().getFullYear()} Forte Migration. All Rights Reserved. MARN: 2619201
                </div>
            </div>
        </footer>
    );
}
