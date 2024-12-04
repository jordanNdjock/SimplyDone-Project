import { FcGoogle } from 'react-icons/fc';

import { Button } from '@/src/components/ui/button';
import { Checkbox } from '@/src/components/ui/checkbox';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';

const Login = () => {
  return (
    <section className="pb-32">
      <div className="container">
        <div className="flex flex-col gap-4">
          <div className="relative flex flex-col items-center overflow-hidden pb-2 pt-32">
            <img
              src="https://www.shadcnblocks.com/images/block/block-1.svg"
              alt="logo"
              className="mb-4 h-10 w-auto"
            />
            <p className="text-2xl font-bold">Login</p>
          </div>
          <div className="z-10 mx-auto w-full max-w-sm rounded-md bg-background px-6 py-12 shadow">
            <div>
              <div className="grid gap-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input type="email" placeholder="Enter your email" required />
                </div>
                <div>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="mt-2 w-full">
                  Login
                </Button>
                <Button variant="outline" className="w-full">
                  <FcGoogle className="mr-2 size-5" />
                  Sign up with Google
                </Button>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-3 flex justify-center gap-1 text-sm text-muted-foreground">
            <a href="#" className="font-medium text-primary">
              Sign up
            </a>
            <span> - </span>
            <a href="#" className="font-medium text-primary">
              Reset Password
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
