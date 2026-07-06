import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { adminConfig } from "@/data/adminConfig";
import { apiPost, setToken } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface LoginFormData {
  username: string;
  wole: string;
}

type AdminKey = keyof typeof adminConfig;

interface CollegeCard {
  id: AdminKey;
  name: string;
  title: string;
  icon: string | any;
  route: string;
  color: string;
}

const variantStyles: Record<string, string> = {
  colerm: "bg-sky-500/10 border-sky-500/20 hover:bg-sky-500/20",
  sslm: "bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/20",
  wma: "bg-cyan-500/10 border-cyan-500/20 hover:bg-cyan-500/20",
  geo: "bg-[#5f67ac]/10 border-[#5f67ac]/20 hover:bg-[#5f67ac]/20",
  aqua: "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20",
  pbst: "bg-fuchsia-500/10 border-fuchsia-500/20 hover:bg-fuchsia-500/20",
  emt: "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20",
  ppcp: "bg-violet-500/10 border-violet-500/20 hover:bg-violet-500/20",
  colphys: "bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20",
  naps: "bg-[#5f67ac]/10 border-[#5f67ac]/20 hover:bg-[#5f67ac]/20",
  cpt: "bg-[#5f67ac]/10 border-[#5f67ac]/20 hover:bg-[#5f67ac]/20",
  fossu: "bg-slate-500/10 border-slate-500/20 hover:bg-slate-500/20",
};

const colleges: CollegeCard[] = Object.entries(adminConfig).map(([key, config]) => ({
  id: key as AdminKey,
  name: config.variant.toUpperCase(),
  title: config.title,
  icon: config.image,
  route: `/admin/${config.variant}`,
  color: variantStyles[config.variant] ?? "bg-slate-500/10 border-slate-500/20 hover:bg-slate-500/20",
}));

function AdminPanel() {
  const [selectedCollege, setSelectedCollege] = useState<CollegeCard | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const form = useForm<LoginFormData>({
    defaultValues: { 
      username: "",
      wole: ""
    }
  });

  useEffect(() => {
    if (!localStorage.getItem("isLoggedIn")) {
      localStorage.setItem("isLoggedIn", "false");
    }
  }, []);

  const selectedConfig = selectedCollege ? adminConfig[selectedCollege.id] : null;

  const handleCollegeClick = (college: CollegeCard) => {
    setLoginError(null);
    setSelectedCollege(college);
    setIsDialogOpen(true);
  };

  const handleLogin = async (data: LoginFormData) => {
    if (!selectedConfig) {
      setLoginError("Please select a college before logging in.");
      return;
    }

    try {
      await login(data.username, data.wole);

      localStorage.setItem("adminCollege", selectedCollege?.id ?? selectedConfig.variant);
      setLoginError(null);
      setIsDialogOpen(false);
      navigate(selectedCollege?.route || "/admin");
      form.reset();
    } catch (err: any) {
      setLoginError(err.message || "Invalid username or password for this administration.");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" /> */}
      {/* <div className="pointer-events-none absolute right-0 top-24 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" /> */}

      <div className="container relative mx-auto px-4 py-10">
        <div className="mb-12 text-center">
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl font-bold text-foreground sm:text-5xl">
            Administrative Portal
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Choose your college dashboard and sign in with the official admin credentials.
          </motion.p>
        </div>

        <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {colleges.map((college, index) => {
            const IconComponent = college.icon;

            return (
              <motion.div
                key={college.id}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
              >
                <Card
                  onClick={() => handleCollegeClick(college)}
                  className={`cursor-pointer border-2 bg-white/70 shadow-xl shadow-slate-900/10 backdrop-blur ${college.color}`}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border border-white/20 bg-white/10">
                      {typeof IconComponent === "string" ? (
                        <img src={IconComponent} alt={college.title} className="h-full w-full object-cover" />
                      ) : (
                        <IconComponent className="h-12 w-12 text-primary" />
                      )}
                    </div>
                    <CardTitle className="text-lg font-semibold text-foreground">
                      {college.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{college.title}</p>
                  </CardHeader>

                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground">Tap to open the secure login panel.</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <AnimatePresence>
          {isDialogOpen && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="sm:max-w-lg">
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                >
                  <DialogHeader>
                    <DialogTitle className="text-center">Login to {selectedCollege?.title}</DialogTitle>
                  </DialogHeader>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="username"
                        rules={{ required: "Username is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your username"
                                {...field}
                                className="w-full"
                                onChange={(event) => {
                                  field.onChange(event);
                                  setLoginError(null);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="wole"
                        rules={{ required: "Password is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Enter your password"
                                  {...field}
                                  className="w-full pr-12"
                                  onChange={(event) => {
                                    field.onChange(event);
                                    setLoginError(null);
                                  }}
                                />
                                <button
                                  type="button"
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                  onClick={() => setShowPassword((prev) => !prev)}
                                  aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {loginError && (
                        <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                          {loginError}
                        </div>
                      )}

                      <div className="flex gap-3 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsDialogOpen(false);
                            setLoginError(null);
                          }}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                          Login
                        </Button>
                      </div>
                      <p className="text-center text-sm text-muted-foreground pt-2">
                        <Link to="/admin/register" className="text-primary hover:underline" onClick={() => setIsDialogOpen(false)}>
                          Register a new partner account
                        </Link>
                      </p>
                    </form>
                  </Form>
                </motion.div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AdminPanel;
