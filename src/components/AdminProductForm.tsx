import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number | null;
  stripe_url: string | null;
  video_url: string | null;
}

interface AdminProductFormProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

const AdminProductForm = ({ product, open, onClose, onSave }: AdminProductFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stripeUrl, setStripeUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setDescription(product.description);
      setPrice(product.price?.toString() || '');
      setStripeUrl(product.stripe_url || '');
      setVideoUrl(product.video_url || '');
    } else {
      setTitle('');
      setDescription('');
      setPrice('');
      setStripeUrl('');
      setVideoUrl('');
    }
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const productData = {
      title,
      description,
      price: price ? parseFloat(price) : null,
      stripe_url: stripeUrl || null,
      video_url: videoUrl || null,
    };

    try {
      if (product) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);

        if (error) throw error;

        toast({
          title: 'Product updated',
          description: 'The product has been updated successfully.',
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;

        toast({
          title: 'Product created',
          description: 'The new product has been created successfully.',
        });
      }

      onSave();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">
            {product ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-input border-border"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-input border-border min-h-[100px]"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price" className="text-foreground">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-input border-border"
              placeholder="29.99"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stripeUrl" className="text-foreground">Stripe Payment Link</Label>
            <Input
              id="stripeUrl"
              type="url"
              value={stripeUrl}
              onChange={(e) => setStripeUrl(e.target.value)}
              className="bg-input border-border"
              placeholder="https://buy.stripe.com/..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="videoUrl" className="text-foreground">YouTube Video URL</Label>
            <Input
              id="videoUrl"
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="bg-input border-border"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-border"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : product ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminProductForm;
