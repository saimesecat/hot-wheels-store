import React from 'react'
import { Dialog } from '@headlessui/react'
import { motion } from 'framer-motion'

const panelVariants = {
  hidden: { x: '100%' },
  show:   { x: 0 },
}

export function DetailDrawer({
  open,
  onClose,
  title,
  detail,
}: {
  open: boolean
  onClose: () => void
  title: string
  detail: any
}) {
  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" />
      <motion.div
        className="fixed inset-y-0 right-0 w-full sm:max-w-md bg-secondary dark:bg-primary p-6 overflow-auto"
        initial="hidden"
        animate="show"
        exit="hidden"
        variants={panelVariants}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <Dialog.Panel>
          <Dialog.Title className="text-xl font-semibold mb-4 text-primary dark:text-secondary">
            {title}
          </Dialog.Title>
          <pre className="bg-white dark:bg-gray-800 p-4 rounded text-sm text-primary dark:text-secondary">
            {JSON.stringify(detail, null, 2)}
          </pre>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-accent text-white rounded hover:bg-opacity-90"
          >
            Close
          </button>
        </Dialog.Panel>
      </motion.div>
    </Dialog>
  )
}