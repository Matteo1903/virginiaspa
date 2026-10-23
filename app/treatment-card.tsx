"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type TreatmentCardProps = {
  id: string; title: string; subtitle: string; summary: string; image: string; description: string;
  meta?: string; price?: string; expanded: boolean; onToggle: () => void;
  read: string; close: string; closeAria: string; kicker: string; back: string;
  action: string; onAction?: () => void; actionHref?: string;
};

export function TreatmentCard(props: TreatmentCardProps) {
  const trigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (props.expanded) closeButton.current?.focus({ preventScroll: true });
  }, [props.expanded]);
  const close = () => {
    props.onToggle();
    requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }));
  };
  return <article id={props.id} className={`product-card${props.expanded ? " is-description-open" : ""}`} onKeyDown={(event) => {
    if (event.key === "Escape" && props.expanded) { event.stopPropagation(); close(); }
  }}>
    <div className="product-image"><Image src={props.image} alt={props.title} fill unoptimized sizes="(max-width: 700px) 100vw, 33vw" /></div>
    <div className="product-copy" inert={props.expanded}>
      <p>{props.subtitle}</p><h3>{props.title}</h3><span>{props.summary}</span>
      {(props.meta || props.price) && <div><small>{props.meta}</small>{props.price && <strong>{props.price}</strong>}</div>}
      <button ref={trigger} className="product-description-trigger" type="button" aria-expanded={props.expanded} aria-controls={`description-${props.id}`} onClick={props.onToggle}>{props.read}<span aria-hidden="true">→</span></button>
      {props.actionHref ? <a href={props.actionHref}>{props.action}<span aria-hidden="true">↗</span></a> : <button type="button" onClick={props.onAction}>{props.action}<span aria-hidden="true">＋</span></button>}
    </div>
    <div className="product-description-overlay" id={`description-${props.id}`} aria-hidden={!props.expanded} inert={!props.expanded} role="region" aria-label={props.title}>
      <button ref={closeButton} className="product-description-close" type="button" onClick={close} aria-label={`${props.closeAria} ${props.title}`}>{props.close} <span aria-hidden="true">×</span></button>
      <p>{props.kicker}</p><h3>{props.title}</h3>
      <div>{props.description.split("\n\n").map((paragraph) => {
        const [title, ...body] = paragraph.split("\n");
        return body.length ? <div className="description-part" key={paragraph}><strong>{title}</strong><p>{body.join(" ")}</p></div> : <p key={paragraph}>{paragraph}</p>;
      })}</div>
      <button className="product-description-back" type="button" onClick={close}>{props.back} <span aria-hidden="true">←</span></button>
    </div>
  </article>;
}
