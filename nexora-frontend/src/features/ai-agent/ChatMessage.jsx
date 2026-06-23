import React from "react";
import { User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import AnimatedAIAssistant from "./AnimatedAIAssistant";

const ChatMessage = ({ message, className = "" }) => {
	const isUser = message.role === "user";
	const content =
		typeof message.content === "string"
			? message.content
			: message.content?.explanation || message.content?.answer || "";

	return (
			<div className={`flex w-full items-end gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
				{!isUser && (
					<div className="flex-shrink-0 self-start pt-1">
						<AnimatedAIAssistant state={message.isError ? "error" : "idle"} size={32} />
					</div>
				)}

				<div className={`w-full max-w-[92%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[65%] ${isUser ? "flex justify-end" : ""}`}>
					<div
						className={`rounded-3xl px-4 py-3 text-[15px] leading-6 shadow-sm ${
							isUser
								? "rounded-br-lg bg-slate-900 text-white"
								: "rounded-bl-lg border border-slate-200 bg-slate-100 text-slate-900"
						} ${className}`}
					>
						<div className="leading-relaxed">
							<ReactMarkdown
								remarkPlugins={[remarkGfm]}
								rehypePlugins={[rehypeRaw, rehypeSanitize]}
								components={{
									h1: ({ node, ...props }) => <h1 className="mb-1 text-base font-semibold" {...props} />,
									h2: ({ node, ...props }) => <h2 className="mb-1 text-sm font-semibold" {...props} />,
									h3: ({ node, ...props }) => <h3 className="mb-0.5 mt-1 text-sm font-semibold" {...props} />,
									p: ({ node, ...props }) => <p className="mb-1 last:mb-0" {...props} />,
									ul: ({ node, ...props }) => <ul className="mb-1 list-disc pl-4 last:mb-0" {...props} />,
									ol: ({ node, ...props }) => <ol className="mb-1 list-decimal pl-4 last:mb-0" {...props} />,
									li: ({ node, ...props }) => <li className="mb-0.5" {...props} />,
									strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
									em: ({ node, ...props }) => <em className="italic" {...props} />,
									code: ({ node, inline, ...props }) =>
										inline ? (
											<code className="rounded bg-slate-200 px-1 py-0.5 font-mono text-[0.9em] text-slate-800" {...props} />
										) : (
											<code className="my-1 block overflow-x-auto rounded bg-slate-800 p-2 font-mono text-xs text-slate-100" {...props} />
										),
									table: ({ node, ...props }) => (
										<div className="my-1 w-full overflow-x-auto">
											<table className="border border-slate-300 text-xs" {...props} />
										</div>
									),
									thead: ({ node, ...props }) => <thead className="bg-slate-200" {...props} />,
									th: ({ node, ...props }) => <th className="px-2 py-1 text-left font-semibold" {...props} />,
									td: ({ node, ...props }) => <td className="px-2 py-1" {...props} />,
									a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
								}}
							>
								{content}
							</ReactMarkdown>
						</div>
					</div>
				</div>

				{isUser && (
					<div className="flex-shrink-0 self-start pt-1">
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm">
							<User size={15} />
						</div>
					</div>
				)}
		</div>
	);
};

export default ChatMessage;
