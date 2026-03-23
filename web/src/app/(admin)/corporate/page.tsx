'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2, Users, Plane, Plus, Search, Edit, Trash2,
  TrendingUp, ChevronRight, Mail, Phone, ArrowLeft,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import api from '@/lib/api';
import { formatDate, cn } from '@/lib/utils';
import type { CorporateProgram, CorporateEmployee } from '@/types';
import toast from 'react-hot-toast';

const planOptions = [
  { value: 'BASIC', label: 'Basic' },
  { value: 'PROFESSIONAL', label: 'Professional' },
  { value: 'ENTERPRISE', label: 'Enterprise' },
];

const statusColors: Record<string, 'success' | 'danger' | 'warning'> = {
  ACTIVE: 'success',
  INACTIVE: 'danger',
  TRIAL: 'warning',
};

// Demo data
const demoPrograms: CorporateProgram[] = [
  {
    id: '1',
    companyName: 'TechCorp International',
    plan: 'ENTERPRISE',
    employeeCount: 245,
    activeTravelers: 23,
    status: 'ACTIVE',
    contactEmail: 'hr@techcorp.com',
    contactPhone: '+1-555-0100',
    startDate: '2024-01-01',
    createdAt: '2024-01-01',
    employees: [
      { id: 'e1', programId: '1', firstName: 'John', lastName: 'Smith', email: 'john@techcorp.com', status: 'ACTIVE', travelStatus: 'TRAVELING', currentCountry: 'Thailand', createdAt: '2024-01-05' },
      { id: 'e2', programId: '1', firstName: 'Emma', lastName: 'Johnson', email: 'emma@techcorp.com', status: 'ACTIVE', travelStatus: 'HOME', createdAt: '2024-01-10' },
      { id: 'e3', programId: '1', firstName: 'Michael', lastName: 'Chen', email: 'michael@techcorp.com', status: 'ACTIVE', travelStatus: 'TRAVELING', currentCountry: 'India', createdAt: '2024-02-01' },
    ],
  },
  {
    id: '2',
    companyName: 'Global Finance Ltd',
    plan: 'PROFESSIONAL',
    employeeCount: 89,
    activeTravelers: 8,
    status: 'ACTIVE',
    contactEmail: 'admin@globalfinance.com',
    startDate: '2024-02-15',
    createdAt: '2024-02-15',
  },
  {
    id: '3',
    companyName: 'StartupXYZ',
    plan: 'BASIC',
    employeeCount: 15,
    activeTravelers: 2,
    status: 'TRIAL',
    contactEmail: 'ops@startupxyz.io',
    startDate: '2024-03-01',
    createdAt: '2024-03-01',
  },
];

export default function CorporateDashboardPage() {
  const [programs, setPrograms] = useState<CorporateProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<CorporateProgram | null>(null);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);

  // Add program form
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newPlan, setNewPlan] = useState('BASIC');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Add employee form
  const [empFirstName, setEmpFirstName] = useState('');
  const [empLastName, setEmpLastName] = useState('');
  const [empEmail, setEmpEmail] = useState('');

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const { data } = await api.get('/admin/corporate-programs');
      setPrograms(data.data || []);
    } catch {
      setPrograms(demoPrograms);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProgram = async () => {
    if (!newCompanyName || !newEmail) {
      toast.error('Please fill required fields');
      return;
    }
    setIsSaving(true);
    try {
      await api.post('/admin/corporate-programs', {
        companyName: newCompanyName,
        plan: newPlan,
        contactEmail: newEmail,
        contactPhone: newPhone,
      });
      toast.success('Program added');
      fetchPrograms();
    } catch {
      // Add locally for demo
      const newProg: CorporateProgram = {
        id: Date.now().toString(),
        companyName: newCompanyName,
        plan: newPlan as any,
        employeeCount: 0,
        activeTravelers: 0,
        status: 'TRIAL',
        contactEmail: newEmail,
        contactPhone: newPhone,
        startDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      setPrograms([...programs, newProg]);
      toast.success('Program added');
    } finally {
      setIsSaving(false);
      setShowAddModal(false);
      setNewCompanyName('');
      setNewPlan('BASIC');
      setNewEmail('');
      setNewPhone('');
    }
  };

  const handleAddEmployee = async () => {
    if (!empFirstName || !empLastName || !empEmail || !selectedProgram) {
      toast.error('Please fill all fields');
      return;
    }
    try {
      await api.post(`/admin/corporate-programs/${selectedProgram.id}/employees`, {
        firstName: empFirstName,
        lastName: empLastName,
        email: empEmail,
      });
      toast.success('Employee added');
    } catch {
      // Add locally for demo
      const newEmp: CorporateEmployee = {
        id: Date.now().toString(),
        programId: selectedProgram.id,
        firstName: empFirstName,
        lastName: empLastName,
        email: empEmail,
        status: 'ACTIVE',
        travelStatus: 'HOME',
        createdAt: new Date().toISOString(),
      };
      const updated = programs.map(p => {
        if (p.id === selectedProgram.id) {
          return {
            ...p,
            employees: [...(p.employees || []), newEmp],
            employeeCount: p.employeeCount + 1,
          };
        }
        return p;
      });
      setPrograms(updated);
      setSelectedProgram(updated.find(p => p.id === selectedProgram.id) || null);
      toast.success('Employee added');
    }
    setShowAddEmployeeModal(false);
    setEmpFirstName('');
    setEmpLastName('');
    setEmpEmail('');
  };

  const totalEmployees = programs.reduce((sum, p) => sum + p.employeeCount, 0);
  const totalTravelers = programs.reduce((sum, p) => sum + p.activeTravelers, 0);

  const filteredPrograms = searchQuery
    ? programs.filter(p => p.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
    : programs;

  const stats = [
    { label: 'Total Programs', value: programs.length, icon: Building2, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400' },
    { label: 'Total Employees', value: totalEmployees, icon: Users, color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400' },
    { label: 'Active Travelers', value: totalTravelers, icon: Plane, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          {selectedProgram ? (
            <button
              onClick={() => setSelectedProgram(null)}
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Programs
            </button>
          ) : null}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {selectedProgram ? selectedProgram.companyName : 'Corporate Programs'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {selectedProgram ? `${selectedProgram.employeeCount} employees` : 'Manage corporate health programs'}
          </p>
        </div>
        {!selectedProgram && (
          <Button
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => setShowAddModal(true)}
          >
            Add Program
          </Button>
        )}
        {selectedProgram && (
          <Button
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => setShowAddEmployeeModal(true)}
          >
            Add Employee
          </Button>
        )}
      </div>

      {/* Program Detail View */}
      {selectedProgram ? (
        <div className="space-y-6">
          {/* Program Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">Plan</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{selectedProgram.plan}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">Employees</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{selectedProgram.employeeCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active Travelers</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{selectedProgram.activeTravelers}</p>
              </CardContent>
            </Card>
          </div>

          {/* Employee List */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900 dark:text-white">Employees</h3>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 px-6 py-3">Name</th>
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 px-6 py-3">Email</th>
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 px-6 py-3">Status</th>
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 px-6 py-3">Travel</th>
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 px-6 py-3">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {(selectedProgram.employees || []).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                        No employees added yet
                      </td>
                    </tr>
                  ) : (
                    (selectedProgram.employees || []).map((emp) => (
                      <tr key={emp.id}>
                        <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-white">
                          {emp.firstName} {emp.lastName}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{emp.email}</td>
                        <td className="px-6 py-3">
                          <Badge variant={emp.status === 'ACTIVE' ? 'success' : 'danger'} size="sm">
                            {emp.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-3">
                          <Badge variant={emp.travelStatus === 'TRAVELING' ? 'info' : 'default'} size="sm">
                            {emp.travelStatus}
                          </Badge>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {emp.currentCountry || '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" className="h-24" />
              ))
            ) : (
              stats.map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        {stat.value.toLocaleString()}
                      </p>
                    </div>
                    <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', stat.color)}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Search */}
          <div className="mb-4">
            <Input
              placeholder="Search programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>

          {/* Programs Table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 px-6 py-3">Company</th>
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 px-6 py-3">Plan</th>
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 px-6 py-3">Employees</th>
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 px-6 py-3">Status</th>
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 px-6 py-3">Start Date</th>
                    <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={6} className="px-6 py-4">
                          <Skeleton className="h-6 w-full" />
                        </td>
                      </tr>
                    ))
                  ) : filteredPrograms.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                        No programs found
                      </td>
                    </tr>
                  ) : (
                    filteredPrograms.map((program) => (
                      <tr
                        key={program.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                        onClick={() => setSelectedProgram(program)}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{program.companyName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{program.contactEmail}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={program.plan === 'ENTERPRISE' ? 'info' : program.plan === 'PROFESSIONAL' ? 'warning' : 'default'}
                            size="sm"
                          >
                            {program.plan}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {program.employeeCount}
                          {program.activeTravelers > 0 && (
                            <span className="text-green-600 dark:text-green-400 ml-1">
                              ({program.activeTravelers} traveling)
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={statusColors[program.status] || 'default'} size="sm">
                            {program.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(program.startDate)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <ChevronRight className="h-4 w-4 text-gray-400 inline" />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* Add Program Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Corporate Program" size="md">
        <div className="p-6 space-y-4">
          <Input
            label="Company Name"
            placeholder="e.g., TechCorp International"
            value={newCompanyName}
            onChange={(e) => setNewCompanyName(e.target.value)}
          />
          <Select
            label="Plan"
            options={planOptions}
            value={newPlan}
            onChange={(e) => setNewPlan(e.target.value)}
          />
          <Input
            label="Contact Email"
            type="email"
            placeholder="hr@company.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <Input
            label="Contact Phone"
            placeholder="+1-555-0100"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button variant="primary" isLoading={isSaving} onClick={handleAddProgram}>Add Program</Button>
          </div>
        </div>
      </Modal>

      {/* Add Employee Modal */}
      <Modal isOpen={showAddEmployeeModal} onClose={() => setShowAddEmployeeModal(false)} title="Add Employee" size="md">
        <div className="p-6 space-y-4">
          <Input
            label="First Name"
            placeholder="John"
            value={empFirstName}
            onChange={(e) => setEmpFirstName(e.target.value)}
          />
          <Input
            label="Last Name"
            placeholder="Smith"
            value={empLastName}
            onChange={(e) => setEmpLastName(e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            placeholder="john@company.com"
            value={empEmail}
            onChange={(e) => setEmpEmail(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => setShowAddEmployeeModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAddEmployee}>Add Employee</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
