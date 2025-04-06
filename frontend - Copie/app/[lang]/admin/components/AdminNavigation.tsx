"use client";

import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Building, Calendar, Users, Settings } from "lucide-react";

interface AdminNavigationProps {
  activeTab: string;
  lang: string;
}

const AdminNavigation = ({ activeTab, lang }: AdminNavigationProps) => {
  return (
    <Tabs value={activeTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="properties" asChild>
          <Link href={`/${lang}/admin/properties`} className="flex items-center">
            <Building className="mr-2 h-4 w-4" />
            Propriétés
          </Link>
        </TabsTrigger>
        <TabsTrigger value="reservations" asChild>
          <Link href={`/${lang}/admin/reservations`} className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Réservations
          </Link>
        </TabsTrigger>
        <TabsTrigger value="users" asChild>
          <Link href={`/${lang}/admin/users`} className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Utilisateurs
          </Link>
        </TabsTrigger>
        <TabsTrigger value="settings" asChild>
          <Link href={`/${lang}/admin/settings`} className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Paramètres
          </Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default AdminNavigation;
