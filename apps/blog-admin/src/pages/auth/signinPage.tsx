import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { useState } from "react";
import { useAuth } from "@/src/base/contexts/AuthContext";
import { useChanooMutation } from "@/src/base/libs/queryHook";

export const SigninPage = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const { login } = useAuth();

	const { mutate } = useChanooMutation<
		{ accessToken: string },
		unknown,
		{ username: string; password: string }
	>(["POST", "/auth/login", (data) => ({ ...data })]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		mutate(
			{
				username: (e.target as HTMLFormElement).username.value,
				password: (e.target as HTMLFormElement).password.value,
			},
			{
				onSuccess: (data) => {
					login(data.data.data.accessToken);
				},
			},
		);
	};
	return (
		<div className="flex flex-col items-center justify-center h-full  w-full">
			<form
				onSubmit={handleSubmit}
				className="w-full flex flex-col gap-4 max-w-sm"
			>
				<h1 className="text-2xl font-bold text-center">로그인</h1>
				<Input
					type="text"
					name="username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder="username"
				/>
				<Input
					type="password"
					name="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Password"
				/>
				<Button type="submit">Sign in</Button>
			</form>
		</div>
	);
};
