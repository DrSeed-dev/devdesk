import { useMemo, useState } from "react";
import { useNow } from "../../hooks/useNow";
import { JWT_SAMPLE, decodeJwt } from "../../lib/tools/jwt";
import { formatLocal, formatRelative } from "../../lib/tools/time";
import Button from "../ui/Button";
import CopyButton from "../ui/CopyButton";
import { CODE_AREA_CLASS, LABEL_CLASS } from "../ui/fieldStyles";

function JsonBlock({ title, value }: { title: string; value: unknown }) {
  const text = JSON.stringify(value, null, 2);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          {title}
        </h3>
        <CopyButton text={text} />
      </div>
      <pre className="thin-scrollbar overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs leading-5 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
        {text}
      </pre>
    </div>
  );
}

function JwtTool() {
  const [token, setToken] = useState("");
  const now = useNow(1000);

  const result = useMemo(() => (token.trim() ? decodeJwt(token) : null), [token]);

  const expiresAt = result?.ok ? result.value.expiresAt : null;
  const isExpired = expiresAt ? expiresAt.getTime() <= now.getTime() : false;

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Paste a JSON Web Token to read what is inside it. This only decodes the
        token. It does not check the signature, so it can't prove a token is
        genuine. Nothing leaves your browser.
      </p>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="jwt-input" className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Token
          </label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              className="px-3 py-1 text-xs"
              onClick={() => setToken(JWT_SAMPLE)}
            >
              Load sample
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="px-3 py-1 text-xs"
              onClick={() => setToken("")}
              disabled={!token}
            >
              Clear
            </Button>
          </div>
        </div>
        <textarea
          id="jwt-input"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          rows={5}
          spellCheck={false}
          maxLength={20000}
          placeholder="eyJhbGciOiJIUzI1NiIs..."
          className={CODE_AREA_CLASS}
        />
      </div>

      {result && !result.ok ? (
        <p
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
        >
          {result.error}
        </p>
      ) : null}

      {result?.ok ? (
        <div className="space-y-4">
          {expiresAt ? (
            <p
              className={`inline-block rounded-lg px-3 py-1.5 text-sm font-semibold ${
                isExpired
                  ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              }`}
            >
              {isExpired
                ? `Expired ${formatRelative(expiresAt, now)}`
                : `Expires ${formatRelative(expiresAt, now)}`}
            </p>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              This token has no expiry time.
            </p>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <JsonBlock title="Header" value={result.value.header} />
            <JsonBlock title="Payload" value={result.value.payload} />
          </div>

          {result.value.times.length > 0 ? (
            <div>
              <h3 className={LABEL_CLASS}>Times in this token</h3>
              <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-200">
                {result.value.times.map((time) => (
                  <li key={time.label}>
                    <span className="font-semibold">{time.label}:</span>{" "}
                    {formatLocal(time.date)}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Signature: {result.value.hasSignature ? "present (not verified)" : "missing"}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default JwtTool;
