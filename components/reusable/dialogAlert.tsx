'use client';
// Nextjs & React
import { Loader } from "lucide-react";

// UI Components
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";

export default function DialogAlert({
    title,
    description,
    name,
    variant,
    loading,
    submitFunction
}: {
    title?: string
    description?: string
    name: string
    variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    loading: boolean
    submitFunction?: (value: any) => void
}) {
    return (
        <div>
            <Dialog modal={false}>
                <DialogTrigger asChild>
                    <Button variant={variant}>{name}</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant={variant} disabled={loading} onClick={() => submitFunction && submitFunction({})}>
                            {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                            Confirm
                        </Button>
                        <DialogClose asChild>
                            <Button>Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}