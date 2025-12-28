import { createFileRoute } from '@tanstack/react-router'
import { useForm, useWatch } from "react-hook-form"
import * as zod from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback } from "react";

type FormDataProps = {
  username: string
}

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const schema = zod.object({
    username: zod.string().min(3, "Username must be at least 3 characters long"),
  })
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    control,
  } = useForm<FormDataProps>({
    resolver: zodResolver(schema),
  });

  const username = useWatch({ control, name: "username" });

  const navigate = Route.useNavigate();
  
  const onSubmit = useCallback((data: FormDataProps) => {
    localStorage.setItem("username", data.username);
    navigate({ to: '/posts' });
  }, [navigate]);

  return (
    <main className="bg-[#DDDDDD] flex justify-center items-center min-h-screen w-h-screen">
      <article className="bg-white rounded-2xl flex flex-col justify-center items-start p-6 gap-6">
        <h1 className="font-bold text-2xl">Welcome to CodeLeap network!</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <label htmlFor="username">Please enter your name</label>
          <input {...register("username")} type="text" id="username" placeholder="John Doe" className="border border-neutral-600 rounded-lg w-full px-3 py-1"/>
            <button disabled={!!errors.username || !dirtyFields.username || !username} type="submit" className="cursor-pointer bg-indigo-400 h-8 w-28 px-8 rounded-lg ml-auto mt-4 text-white text-base font-bold float-right disabled:bg-gray-400 disabled:cursor-not-allowed">ENTER</button>
        </form>
      </article>
    </main>
  )
}