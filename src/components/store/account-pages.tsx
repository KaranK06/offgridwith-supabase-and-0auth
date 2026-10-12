import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Check from "lucide-react/dist/esm/icons/check.js";
import { Button } from "@/components/ui/button";
import { emptyProfile, fetchProfile, saveProfile } from "@/lib/store/account";
import { useAuth } from "@/lib/store/auth";
import { fetchOrders } from "@/lib/store/orders";
import { useStore } from "@/lib/store/context";

// Shown instead of account data when nobody is logged in.
function SignInPrompt() {
  const { open } = useStore();
  return (
    <div className="utility-form">
      <p>Please sign in to see this page.</p>
      <Button onClick={() => open("login")}>Sign in</Button>
    </div>
  );
}

export function EditProfile() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState(emptyProfile);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const userId = user?.id;
  const userEmail = user?.email ?? "";
  // Load this user's profile row from the database once we know who is logged in.
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    fetchProfile(userId)
      .then((value) => {
        if (!cancelled) setProfile({ ...value, email: value.email || userEmail });
      })
      .catch(() => {
        if (!cancelled) setError("We couldn't load your profile.");
      });
    return () => {
      cancelled = true;
    };
  }, [userId, userEmail]);
  if (loading) return <p>Loading…</p>;
  if (!user) return <SignInPrompt />;
  return (
    <form
      className="utility-form"
      onSubmit={async (event) => {
        event.preventDefault();
        setError("");
        try {
          await saveProfile(user.id, profile);
          setSaved(true);
        } catch {
          setError("We couldn't save your profile. Please try again.");
        }
      }}
    >
      {(["name", "email", "mobile", "address"] as const).map((key) => (
        <div className="profile-field" key={key}>
          <label htmlFor={`profile-${key}`}>{key.toUpperCase()}</label>
          {key === "address" ? (
            <textarea
              id={`profile-${key}`}
              className="field"
              rows={3}
              value={profile[key]}
              onChange={(event) => {
                setSaved(false);
                setProfile({ ...profile, [key]: event.target.value });
              }}
            />
          ) : (
            <input
              id={`profile-${key}`}
              className="field"
              type={key === "email" ? "email" : key === "mobile" ? "tel" : "text"}
              value={profile[key]}
              readOnly={key === "email"} // email comes from the Google account
              onChange={(event) => {
                setSaved(false);
                setProfile({ ...profile, [key]: event.target.value });
              }}
            />
          )}
        </div>
      ))}
      <Button type="submit">Save</Button>
      {saved && (
        <p className="mock-success" role="status">
          <Check size={18} /> Profile saved.
        </p>
      )}
      {error && <p role="alert">{error}</p>}
    </form>
  );
}

export function OrderHistory() {
  const { money } = useStore();
  const { user, loading } = useAuth();
  const orders = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: fetchOrders,
    enabled: Boolean(user),
  });
  if (loading || orders.isLoading) return <p>Loading…</p>;
  if (!user) return <SignInPrompt />;
  if (orders.error) return <p role="alert">We couldn't load your orders.</p>;
  if (!orders.data?.length) return <p>No orders yet. Your first one will show up here.</p>;
  return (
    <div className="account-order-list">
      {orders.data.map((order) => (
        <article className="account-order" key={order.number}>
          <div className="account-order-heading">
            <h3>{order.number}</h3>
            <span>{order.date}</span>
          </div>
          <p>{order.items}</p>
          <div className="account-order-heading">
            <strong>{order.status}</strong>
            <strong>{money(order.total)}</strong>
          </div>
        </article>
      ))}
    </div>
  );
}
