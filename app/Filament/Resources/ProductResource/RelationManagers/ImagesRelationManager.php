<?php

namespace App\Filament\Resources\ProductResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ImagesRelationManager extends RelationManager
{
    protected static string $relationship = 'images';

    protected static ?string $recordTitleAttribute = 'Images';
    protected static ?string $pluralLabel = 'Images';

    protected static ?string $title = 'Images';

    protected static ?string $label = 'Image';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\FileUpload::make('image_url')
                    ->label('Image')
                    ->disk('public')
                    ->directory('images/products')
                    ->preserveFilenames()
                    ->maxSize(1024)
                    ->required()
                    ->afterStateUpdated(function ($state) {
                        if ($state instanceof \Illuminate\Http\UploadedFile) {
                            // Ensure original filename is preserved manually
                            return $state->storeAs('images/products', $state->getClientOriginalName(), 's3');
                        }
                    }),
            ])->columns(1);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('Products')
            ->columns([
                Tables\Columns\TextColumn::make('product_id')
                    ->label('Product ID'),
                Tables\Columns\ImageColumn::make('image_url')
                    ->label('Image URL')
                    ->square()
                    ->height(80)
                    ->alignCenter(),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
            ]);
    }
}
