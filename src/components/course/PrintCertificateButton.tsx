'use client'

export default function PrintCertificateButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="btn-pill no-print"
    >
      Print or save as PDF
    </button>
  )
}
