import React, { useState } from 'react';
import { Copy, ExternalLink, Check } from 'lucide-react';
import { toast } from 'react-toastify';

interface WalletAddressProps {
  address: string;
  showExplorer?: boolean;
  explorerUrl?: string;
  maxLength?: number;
  className?: string;
}

const WalletAddress: React.FC<WalletAddressProps> = ({
  address,
  showExplorer = true,
  explorerUrl,
  maxLength = 15,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success('Wallet address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = address;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      toast.success('Wallet address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleViewExplorer = () => {
    const url = explorerUrl || `https://etherscan.io/address/${address}`;
    window.open(url, '_blank');
  };

  const displayAddress = address.length > maxLength 
    ? `${address.substring(0, maxLength)}...` 
    : address;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="font-mono text-sm bg-gray-50 px-2 py-1 rounded">
        {displayAddress}
      </div>
      <div className="flex items-center space-x-1">
        <button
          onClick={handleCopy}
          className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
          title="Copy wallet address"
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-600" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </button>
        {showExplorer && (
          <button
            onClick={handleViewExplorer}
            className="p-1 text-gray-400 hover:text-green-600 transition-colors duration-200"
            title="View on explorer"
          >
            <ExternalLink className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
};

export default WalletAddress;
