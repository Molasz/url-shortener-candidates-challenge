import { useState } from "react";
import { Form, useNavigation } from "react-router";

interface DeleteUrlButtonProps {
  shortCode: string;
}

export function DeleteUrlButton({ shortCode }: DeleteUrlButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const navigation = useNavigation();

  const isDeleting =
    navigation.state === "submitting" &&
    navigation.formData?.get("code") === shortCode;

  if (!isConfirming) {
    return (
      <button
        type="button"
        onClick={() => setIsConfirming(true)}
        aria-label={`Delete short link ${shortCode}`}
        className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline dark:text-red-400 dark:hover:text-red-300"
      >
        Delete
      </button>
    );
  }

  return (
    <Form
      method="post"
      aria-label={`Confirm deletion of ${shortCode}`}
      className="flex flex-wrap items-center gap-2"
    >
      <input type="hidden" name="code" value={shortCode} />
      <span className="text-sm text-gray-500 dark:text-gray-400">Delete?</span>
      <button
        type="submit"
        disabled={isDeleting}
        className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isDeleting ? "Deleting…" : "Yes, delete"}
      </button>
      <button
        type="button"
        onClick={() => setIsConfirming(false)}
        disabled={isDeleting}
        className="rounded-md px-2 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        Cancel
      </button>
    </Form>
  );
}
