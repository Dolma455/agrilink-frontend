"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Bell, Users } from "lucide-react"

// Modal component with background overlay and visible container
function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  if (!open) return null
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "white",
          borderRadius: 8,
          maxWidth: 480,
          width: "90%",
          padding: 24,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <h3 style={{ marginBottom: 16, fontWeight: "bold", fontSize: 20 }}>{title}</h3>
        <div>{children}</div>
        <div style={{ marginTop: 24, textAlign: "right" }}>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}

type Notification = {
  id: number
  title: string
  message: string
  time: string
  read: boolean
  icon: React.ComponentType<{ size?: number }>
  color: string
  bgColor: string
  details?: {
    name: string
    email: string
    phone: string
    address: string
    registrationDate: string
  }
  status?: "pending" | "approved" | "rejected"
}

export default function FarmerVerificationNotifications() {
  const initialNotifications: Notification[] = [
    {
      id: 1,
      title: "Account Verification Needed",
      message: "New farmer account created by Laxmi Gurung. Verification required.",
      time: "Just now",
      read: false,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      status: "pending",
      details: {
        name: "Laxmi Gurung",
        email: "laxmi.gurung@example.com",
        phone: "+977-9800000000",
        address: "Kathmandu, Nepal",
        registrationDate: "2025-07-15",
      },
    },
    {
      id: 2,
      title: "New vendor requests",
      message: "Your product Tomatoes was requested by 2 vendors.",
      time: "2 minutes ago",
      read: false,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: 3,
      title: "Product expiry warning",
      message: "Your product Beans is nearing its availability end date.",
      time: "1 hour ago",
      read: false,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState<Notification | null>(null)

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const handleApproveReject = (id: number, approve: boolean) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              status: approve ? "approved" : "rejected",
              read: true,
            }
          : n
      )
    )
    // Also close modal if open for this notification
    if (modalContent?.id === id) setModalOpen(false)
  }

  const showDetails = (notification: Notification) => {
    if (notification.details) {
      setModalContent(notification)
      setModalOpen(true)
      markAsRead(notification.id)
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: 24 }}>
      <div style={{ maxWidth: 640, margin: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Bell size={32} />
          <h1 style={{ fontSize: 28, fontWeight: "bold" }}>Farmer Verification Notifications</h1>
        </div>

        <Card className="shadow-lg border border-gray-200">
          <CardHeader className="sticky top-0 z-10 bg-white">
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Verify farmer accounts or check recent updates.</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent style={{ maxHeight: 480, overflowY: "auto" }}>
            {notifications.length === 0 && (
              <p style={{ textAlign: "center", color: "#6b7280", padding: 32 }}>
                No notifications.
              </p>
            )}

            {notifications.map((notification) => {
              const Icon = notification.icon
              const isVerification = notification.status !== undefined

              return (
                <div
                  key={notification.id}
                  style={{
                    display: "flex",
                    gap: 16,
                    padding: 16,
                    borderRadius: 8,
                    backgroundColor: notification.read ? "white" : notification.bgColor,
                    marginBottom: 12,
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1 }}>
                    <div
                      style={{
                        backgroundColor: notification.bgColor,
                        borderRadius: "50%",
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: notification.color,
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4
                        style={{
                          fontWeight: notification.read ? "normal" : "600",
                          marginBottom: 4,
                          fontSize: 16,
                        }}
                      >
                        {notification.title}
                      </h4>
                      <p style={{ color: "#6b7280", marginBottom: 6 }}>{notification.message}</p>
                      <span style={{ fontSize: 12, color: "#9ca3af" }}>{notification.time}</span>
                    </div>
                  </div>

                  {isVerification && (
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        style={{ color: "#7c3aed" }}
                        onClick={() => showDetails(notification)}
                      >
                        View Details
                      </Button>

                      {notification.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            style={{ borderColor: "green", color: "green" }}
                            onClick={() => handleApproveReject(notification.id, true)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            style={{ borderColor: "red", color: "red" }}
                            onClick={() => handleApproveReject(notification.id, false)}
                          >
                            Reject
                          </Button>
                        </>
                      )}

                      {notification.status === "approved" && (
                        <Badge variant="default" className="bg-green-600">Approved</Badge>
                      )}

                      {notification.status === "rejected" && (
                        <Badge variant="destructive">Rejected</Badge>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Modal */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Farmer Account Details">
          {modalContent ? (
            <div>
              <ul
                style={{
                  listStyle: "disc",
                  paddingLeft: 20,
                  fontSize: 14,
                  lineHeight: 1.5,
                  marginBottom: 20,
                }}
              >
                <li>
                  <strong>Name:</strong> {modalContent.details?.name}
                </li>
                <li>
                  <strong>Email:</strong> {modalContent.details?.email}
                </li>
                <li>
                  <strong>Phone:</strong> {modalContent.details?.phone}
                </li>
                <li>
                  <strong>Address:</strong> {modalContent.details?.address}
                </li>
                <li>
                  <strong>Registration Date:</strong> {modalContent.details?.registrationDate}
                </li>
              </ul>

              {modalContent.status === "pending" && (
                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                  <Button
                    variant="outline"
                    style={{ borderColor: "green", color: "green" }}
                    onClick={() => handleApproveReject(modalContent.id, true)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    style={{ borderColor: "red", color: "red" }}
                    onClick={() => handleApproveReject(modalContent.id, false)}
                  >
                    Reject
                  </Button>
                </div>
              )}

              {modalContent.status === "approved" && (
                <Badge variant="default" className="bg-green-600">Already Approved</Badge>
              )}

              {modalContent.status === "rejected" && (
                <Badge variant="destructive">Already Rejected</Badge>
              )}
            </div>
          ) : (
            <p>No details available.</p>
          )}
        </Modal>
      </div>
    </div>
  )
}
