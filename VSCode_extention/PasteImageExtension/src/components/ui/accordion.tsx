import React, { useState, ReactNode } from 'react';

export const Accordion = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};

export const AccordionItem = ({ value, children }: { value: string; children: ReactNode }) => {
  return <div className="border border-gray-300 p-2 my-2 rounded">{children}</div>;
};

export const AccordionTrigger = ({ children }: { children: ReactNode }) => {
  return <div className="font-bold">{children}</div>;
};

export const AccordionContent = ({ children }: { children: ReactNode }) => {
  return <div className="mt-2">{children}</div>;
};
