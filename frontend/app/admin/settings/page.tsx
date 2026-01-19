'use client';

import { Settings as SettingsIcon, Save } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="p-8 space-y-6">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <SettingsIcon className="w-6 h-6" />
                    System Settings
                </h1>
                <p className="text-muted-foreground">Configure global inventory parameters and notification rules.</p>
            </div>

            <div className="max-w-2xl bg-card border rounded-xl p-6 shadow-sm space-y-6">
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Inventory Defaults</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Company Name</label>
                            <input className="w-full px-3 py-2 border rounded-md" defaultValue="Jon Monday Group" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Currency</label>
                            <input className="w-full px-3 py-2 border rounded-md" defaultValue="USD" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                    <button className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
