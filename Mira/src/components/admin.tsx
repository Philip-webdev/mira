import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, User, GraduationCap, Fullscreen, Mail } from "lucide-react";
import React, { useEffect } from "react";


const adminX = () => {
  return (
    <div>
      <h2>AdminX</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Manage Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="userSearch">Search User</Label>
            <Input id="userSearch" placeholder="Enter user email or ID" />
            <Button className="mt-2">Search</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="courseSelect">Select Course</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="course1">Course 1</SelectItem>
                <SelectItem value="course2">Course 2</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Input id="paymentMethod" placeholder="Enter payment method" />
            <Button className="mt-2">Update Payment</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="notificationEmail">Notification Email</Label>
            <Input id="notificationEmail" placeholder="Enter email for notifications" />
            <Button className="mt-2">Send Notification</Button>
          </CardContent>
        </Card>
    </div>   </div>
  );
};

export default adminX;