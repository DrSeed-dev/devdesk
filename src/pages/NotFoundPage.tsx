import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
      <p className="text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        404
      </p>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        There is nothing at this address.
      </p>
      <Link
        to="/"
        className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
      >
        Back to your desk
      </Link>
    </div>
  );
}

export default NotFoundPage;
