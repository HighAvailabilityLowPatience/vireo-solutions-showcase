import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import AdminProductForm from '@/components/AdminProductForm';
import AdminProductTable from '@/components/AdminProductTable';
import AdminVideoManager from '@/components/AdminVideoManager';
import { AdminSiteSettings } from '@/components/AdminSiteSettings';
import logo from '@/assets/logo.png';
import { Plus, LogOut, Package, Video, Settings } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number | null;
  stripe_url: string | null;
  video_url: string | null;
}

const Admin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (!isAdmin) {
        toast({
          title: 'Access denied',
          description: 'You do not have admin privileges.',
          variant: 'destructive',
        });
        navigate('/');
      }
    }
  }, [user, isAdmin, loading, navigate, toast]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchProducts();
    }
  }, [user, isAdmin]);

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load products.',
        variant: 'destructive',
      });
    } else {
      setProducts(data || []);
    }
    setIsLoading(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleDelete = async (productId: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Product deleted',
        description: 'The product has been removed.',
      });
      fetchProducts();
    }
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading || (!isAdmin && user)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-6 md:px-12 border-b border-border">
        <div className="flex items-center justify-between">
          <a href="/">
            <img src={logo} alt="Vireo Vitalis Solutions" className="h-12 w-auto" />
          </a>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8 md:py-12">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="mb-8 bg-muted/50">
            <TabsTrigger value="products" className="flex items-center gap-2 data-[state=active]:bg-background">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2 data-[state=active]:bg-background">
              <Video className="h-4 w-4" />
              Hero Videos
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-background">
              <Settings className="h-4 w-4" />
              Site Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Product Management</h1>
                <p className="text-muted-foreground mt-1">Add, edit, and manage your products</p>
              </div>
              <Button
                onClick={handleAddNew}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading products...
              </div>
            ) : (
              <AdminProductTable
                products={products}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </TabsContent>

          <TabsContent value="videos">
            <AdminVideoManager />
          </TabsContent>

          <TabsContent value="settings">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-foreground">Site Settings</h1>
              <p className="text-muted-foreground mt-1">Manage site access and configuration</p>
            </div>
            <AdminSiteSettings />
          </TabsContent>
        </Tabs>
      </main>

      <AdminProductForm
        product={editingProduct}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={fetchProducts}
      />
    </div>
  );
};

export default Admin;
