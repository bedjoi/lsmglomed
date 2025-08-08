"use client"; 
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import  { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import Link from "next/link";
import { Ghost } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const formSchema = z.object({
    title:z.string().min(1,{message: "Title is required"})
})


const createCourse = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema), defaultValues: {
            title:""
        }
    })
    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
              const response = await axios.post(`/api/courses `, values);
            console.log("Course created successfully:", response.data);
          router.push(`/teacher/courses/${response.data.id}`);
          toast.success("Course created successfully!");
              // Redirect or perform any other action after successful creation
              // For example, you can redirect to the course details page
              // router.push(`/teacher/courses/${response.data.id}`);
        
       } catch (error) {
            if (axios.isAxiosError(error)) {
               toast.error("Failed to create course. Please try again.");
               // Handle specific error response from the server
            
              
           } else {
                toast.error("Unexpected error:");
           }
        
       }
    }


  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            <div>
              <h1 className="text-2xl font-bold">Name Your course
                  
              </h1>
              <p className="text-sm text-slate-600">What would you like to name your course? Don't worry, you can always change it later.</p>
              <Form {...form}>
                {/* <FormItem>
                  <FormLabel htmlFor="title">Course Title</FormLabel>
                  <FormControl>
                    <Input id="title" placeholder="Enter course title" />
                  </FormControl>
                  <FormMessage />
                </FormItem> */}
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
                      <FormField 
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                              <FormItem >
                                  <FormLabel>
                                      Course title
                                  </FormLabel>
                                  <FormControl>
                                      <Input disabled={isSubmitting}
                                          placeholder="e.G. 'Advanced web developement'"
                                      {...field} />

                                  </FormControl>
                                  <FormDescription >
                                      What will you teach in this course
                                  </FormDescription>
                                  <FormMessage />
                                  
                          </FormItem>
                          )} />
                      
                      <div className="flex items-center gap-x-2">
                          <Link href="/">
                              <Button type="button" variant={"ghost"} >Cancel</Button> </Link>
                            <Button type="submit" disabled ={!isValid || isSubmitting}>Continue</Button>
                      </div>
                      
                  </form>
              </Form>

            </div>
    </div>
  )
}

export default createCourse